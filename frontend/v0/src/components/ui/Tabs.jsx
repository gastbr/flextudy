export function Tabs({ children, className = "", ...props }) {
    return (
        <div className={`flex flex-col ${className}`} {...props}>
            {children}
        </div>
    );
}

export function TabsList({ children, className = "", ...props }) {
    return (
        <div className={`flex flex-row ${className}`} {...props}>
            {children}
        </div>
    );
}

export function TabsTrigger({ children, className = "", ...props }) {
    return (
        <button className={`tab-trigger ${className}`} {...props}>
            {children}
        </button>
    );
}