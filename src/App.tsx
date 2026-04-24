import "./App.css";
import {useState} from "react";
import { MainPage } from "./ui/mainPage";
import { DonePage } from "./ui/donePage";
import { ErrorPage } from "./ui/errorPage";

import { Analytics } from "@vercel/analytics/next"

type Page = "form" | "done" | "error";

function App() {
    const [page, setPage] = useState<Page>("form");

    if (page === "done") {
        return <DonePage onBack={() => window.location.href = 'https://reflexshop.hu/Tarsasjatekok/Reflexshop-tarsasjatekok'} />;
    }

    if (page === "error") {
        return <ErrorPage onBack={() => setPage("form")} />;
    }

    return (
        <>
            <MainPage
                onSuccess={() => setPage("done")}
                onError={() => setPage("error")}
            />
            <Analytics />
        </>

    );
}

export default App;