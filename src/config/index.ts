export const PRODUCT_CATEGORIES = [
    {
        label: "UI Kits",
        value: "ui_kits" as const,
        featured: [
            {
                name: "Editor picks",
                href: "#",
                imageSrc: "/nav/ui-kits/mixed.png"
            },
            {
                name: "New Arrivals",
                href: "#",
                imageSrc: "/nav/ui-kits/blue.png"
            },
            {
                name: "Best sellers",
                href: "#",
                imageSrc: "/nav/ui-kits/purple.png"
            }
        ]
    },
    {
        label: "Icons",
        value: "icons" as const,
        featured: [
            {
                name: "Favorite Icon Picks",
                href: "#",
                imageSrc: "/nav/icons/picks.png"
            },
            {
                name: "New Arrivals",
                href: "#",
                imageSrc: "/nav/icons/new.png"
            }, {
                name: "Best Selling Icons",
                href: "#",
                imageSrc: "/nav/icons/bestsellers.png"
            }
        ]
    }
]