'use client';

interface MenuLinkProps {
    label: string;
    onClick: () => void;
    className?: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({
    label,
    onClick,
    className = ""
}) => {
    return (
        <div 
            onClick={onClick}
            className={`px-5 py-4 cursor-pointer hover:bg-gray-100 transition text-sm sm:text-base ${className}`}
        >
            {label}
        </div>
    )
}

export default MenuLink;