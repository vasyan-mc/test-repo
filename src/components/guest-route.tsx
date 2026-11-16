import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export const GuestRoute = () => {
	const [isLogin, setIsLogin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			setIsLogin(!!session);
			setIsLoading(false);
		};

		checkUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsLogin(!!session);
			setIsLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	if (isLoading) return <div>Загрузка...</div>;

	if (isLogin) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};
