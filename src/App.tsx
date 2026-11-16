import { useEffect, useState } from "react";
import type { VpnList } from "./types/types";
import { supabase } from "./lib/supabase";
import { VpnCard } from "./components/vpn-card";
import { AddVpnForm } from "./components/add-vpn-form";
import { isAdmin } from "./lib/admin";

function App() {
	const [admin, setAdmin] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [vpnList, setVpnList] = useState<VpnList[]>([]);

	useEffect(() => {
		const getList = async () => {
			setIsLoading(true);
			try {
				const checkAdmin = await isAdmin();
				const { data } = await supabase.from("list").select("*");

				setVpnList(data);
				setAdmin(checkAdmin);
			} catch (e) {
				if (e instanceof Error) {
					console.error(e.message);
				}
			} finally {
				setIsLoading(false);
			}
		};

		getList();
	}, []);

	if (isLoading) return <h1>Loading...</h1>;

	return (
		<div className="flex flex-col justify-between items-center gap-3 mt-6">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Ссылки на VPN
			</h1>

			<div className="w-full flex flex-col justify-center items-center gap-6">
				{admin && <AddVpnForm />}
			</div>

			<div className="flex flex-col justify-center items-center gap-4">
				{vpnList.length > 0 ? (
					vpnList?.map((item) => <VpnCard item={item} key={item.id} />)
				) : (
					<div>Список пуст</div>
				)}
			</div>
		</div>
	);
}

export default App;
