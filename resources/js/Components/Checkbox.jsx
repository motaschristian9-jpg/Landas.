export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-300 text-emerald-500 shadow-sm focus:ring-emerald-500/20 ' +
                className
            }
        />
    );
}
