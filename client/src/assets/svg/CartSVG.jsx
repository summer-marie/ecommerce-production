const CartSVG = ({ count = 0, className = "", size = 32 }) => {
  const displayCount = typeof count === "number" && count > 99 ? "99+" : count;
  const s = Number(size) || 32;
  return (
    <div className={`relative inline-block ${className}`} aria-label="Cart">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="text-stone-300/90 drop-shadow-[0_1px_6px_rgba(56,189,248,0.45)] transition-transform duration-150 hover:scale-105"
        aria-hidden="true"
        focusable="false"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute text-[20px] font-bold text-green-500 select-none pointer-events-none"
          style={{ top: -s * 0.6, right: s * 0.3 }}
          aria-label={`Cart items: ${displayCount}`}
        >
          {displayCount}
        </span>
      )}
      <span className="sr-only">{`Cart item count ${displayCount || 0}`}</span>
    </div>
  );
};

export default CartSVG;
