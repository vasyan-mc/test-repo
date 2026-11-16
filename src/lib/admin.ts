import { supabase } from "./supabase";

export const getUserRole = async (): Promise<string | null> => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data, error } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (error) {
		console.error(error);
		return null;
	}

	return data.role;
};

export const isAdmin = async () => {
	return (await getUserRole()) === "admin";
};
