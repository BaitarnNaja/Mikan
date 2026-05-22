"use client";

import { Box } from "@mui/material";
import { useState } from "react";

type Theme = {
    surfaceSection: string;
    brandPrimary: string;
    font: string;
    layout: "full" | "boxed";
};

export default function ThemeSwitcher() {

    const [theme, setTheme] = useState<Theme>({
        surfaceSection: "#ffffff",
        brandPrimary: "#ff6b00",
        font: "Arial, sans-serif",
        layout: "full",
    });

    const save = async () => {

        const res = await fetch("http://localhost:3001/theme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(theme),
        });

        const data = await res.json();

        console.log("saved", data);
    };

    return (
        <div className="fixed right-6 top-40 bg-white p-4 rounded-xl shadow-xl space-y-3">
            <Box sx={{background:theme.brandPrimary}}>
                <input
                    type="color"
                    value={theme.surfaceSection}
                    onChange={(e) =>
                        setTheme({ ...theme, surfaceSection: e.target.value })
                    }
                />

                <input
                    type="color"
                    value={theme.brandPrimary}
                    onChange={(e) =>
                        setTheme({ ...theme, brandPrimary: e.target.value })
                    }
                />

                <select
                    value={theme.font}
                    onChange={(e) =>
                        setTheme({ ...theme, font: e.target.value })
                    }
                >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Prompt, sans-serif">Prompt</option>
                    <option value="Noto Sans Thai, sans-serif">Noto Sans Thai</option>
                </select>

                <select
                    value={theme.layout}
                    onChange={(e) =>
                        setTheme({ ...theme, layout: e.target.value as "full" | "boxed" })
                    }
                >
                    <option value="full">Full</option>
                    <option value="boxed">Boxed</option>
                </select>

                <button onClick={save}>
                    Save
                </button>
            </Box>
        </div>
    );
}