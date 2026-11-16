import { CheckIcon, CopyIcon } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";

import { useCopyToClipboard } from "@/hooks/use-copy";
import { countryCodes } from "@/lib/countries";
import type { VpnList } from "@/types/types";
import { formatDate } from "@/lib/formatDate";

interface IVpnCard {
	item: VpnList;
}

export const VpnCard = ({ item }: IVpnCard) => {
	const { country, url, created_at, image_url } = item;

	const [copy, isCopied] = useCopyToClipboard();

	const handleCopy = () => copy(url);

	const countryCode = countryCodes[country];

	return (
		<div className="w-full max-w-md rounded-xl border bg-card p-3 flex flex-col gap-3">
			<div className="flex justify-between items-center gap-2">
				<div className="flex items-center gap-1.5">
					{countryCode && (
						<ReactCountryFlag
							countryCode={countryCode}
							svg
							style={{
								width: "1.5em",
								height: "1.5em",
							}}
						/>
					)}

					<span className="font-medium text-sm">
						{country || "Неизвестная страна"}
					</span>
				</div>

				<div className="font-medium text-sm">{formatDate(created_at)}</div>
			</div>

			<InputGroup className="w-full">
				<InputGroupInput
					aria-label="VPN link"
					className="font-mono text-xs sm:text-sm"
					readOnly
					type="text"
					value={url}
				/>

				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label={isCopied ? "Copied" : "Copy"}
						onClick={handleCopy}
						size="icon-xs"
					>
						{isCopied ? (
							<CheckIcon aria-hidden="true" />
						) : (
							<CopyIcon aria-hidden="true" />
						)}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>

			{image_url && <img src={image_url} alt={`VPN-${country}`} />}
		</div>
	);
};
