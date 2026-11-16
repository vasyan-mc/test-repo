import { useState } from "react";
import type { FormEvent } from "react";

import { supabase } from "@/lib/supabase";
import ReactCountryFlag from "react-country-flag";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
	InputGroupButton,
} from "./ui/input-group";
import { countryCodes } from "@/lib/countries";

const countries = Object.entries(countryCodes).map(([name, code]) => ({
	name,
	code,
}));

export const AddVpnForm = () => {
	const [country, setCountry] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const submitForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);

		const url = formData.get("url");
		const image = formData.get("image");

		if (typeof url !== "string" || !url.trim()) {
			console.error("Введите ссылку");
			return;
		}

		if (!country) {
			console.error("Выберите страну");
			return;
		}

		if (!(image instanceof File)) {
			console.error("Некорректный файл");
			return;
		}

		if (image.size > 5 * 1024 * 1024) {
			console.error("Размер фотографии не должен превышать 5 МБ");
			return;
		}

		if (
			image.size > 0 &&
			!["image/jpeg", "image/png", "image/webp"].includes(image.type)
		) {
			console.error("Допустимые форматы: JPG, PNG, WEBP");
			return;
		}

		setIsLoading(true);

		let imagePath: string | null = null;

		try {
			let imageUrl: string | null = null;

			if (image.size > 0) {
				const extension = {
					"image/jpeg": "jpg",
					"image/png": "png",
					"image/webp": "webp",
				}[image.type];

				imagePath = `qr/${crypto.randomUUID()}.${extension}`;

				const { error: uploadError } = await supabase.storage
					.from("qr-codes")
					.upload(imagePath, image, {
						contentType: image.type,
						upsert: false,
					});

				if (uploadError) {
					throw uploadError;
				}

				const { data } = supabase.storage
					.from("qr-codes")
					.getPublicUrl(imagePath);

				imageUrl = data.publicUrl;
			}

			const { error } = await supabase.from("list").insert({
				url: url.trim(),
				country,
				image_url: imageUrl,
			});

			if (error) {
				throw error;
			}

			console.log("VPN успешно добавлен!");

			form.reset();
			setCountry("");
		} catch (error) {
			console.error("Ошибка добавления:", error);

			if (imagePath) {
				await supabase.storage.from("qr-codes").remove([imagePath]);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={submitForm}
			className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full"
		>
			<InputGroup className="max-w-xl py-6">
				<InputGroupInput
					placeholder="Вставьте ссылку..."
					type="url"
					name="url"
					required
					disabled={isLoading}
					className="min-w-0"
				/>

				<InputGroupAddon align="inline-end">
					<label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
						<span className="text-muted-foreground">Фото</span>
						<input
							type="file"
							name="image"
							accept="image/jpeg,image/png,image/webp"
							disabled={isLoading}
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];

								if (file && file.size > 5 * 1024 * 1024) {
									console.error("Размер фотографии не должен превышать 5 МБ");
									e.target.value = "";
								}
							}}
						/>
					</label>

					<Select
						value={country}
						onValueChange={setCountry}
						disabled={isLoading}
					>
						<SelectTrigger className="w-[145px]">
							<SelectValue placeholder="Страна" />
						</SelectTrigger>

						<SelectContent className="max-h-[300px]">
							{countries.map((item) => (
								<SelectItem key={item.code} value={item.name}>
									<span className="flex items-center gap-2">
										<ReactCountryFlag
											countryCode={item.code}
											svg
											style={{
												width: "1.4em",
												height: "1.4em",
											}}
										/>
										<span>{item.name}</span>
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<InputGroupButton type="submit" disabled={isLoading}>
						{isLoading ? "Добавление..." : "Добавить"}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
};
