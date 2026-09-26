type BrandProps = { compact?: boolean };

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="flex items-center gap-2.5" aria-label="SaveMingo home">
      <span
        aria-hidden="true"
        className={compact ? "text-2xl" : "text-[2rem] leading-none"}
      >
        🦩
      </span>
      <div className="leading-none">
        <div className="text-lg font-black tracking-[-0.035em] text-neutral-950">
          SaveMingo
        </div>
        {!compact && (
          <div className="mt-1 text-[11px] font-semibold tracking-[0.12em] text-neutral-500 uppercase">
            Save it. Keep it.
          </div>
        )}
      </div>
    </div>
  );
}
