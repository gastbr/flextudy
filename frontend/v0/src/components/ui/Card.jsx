export function Card({ children, className = "", ...props }) {
    return (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = "", ...props }) {
    return (
        <div className={`p-4 ${className}`} {...props}>
            {children}
        </div>
    );
}