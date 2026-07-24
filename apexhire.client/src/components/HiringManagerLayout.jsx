import { Outlet } from "react-router-dom";

import HiringManagerSidebar
    from "./HiringManagerSidebar";

export default function HiringManagerLayout() {
    return (
        <div className="hm-layout">

            <HiringManagerSidebar />

            <main className="hm-main-content">
                <Outlet />
            </main>

        </div>
    );
}
