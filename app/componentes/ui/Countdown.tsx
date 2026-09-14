export function Countdown({ tempo, subtitulo }: { tempo: string, subtitulo: string }) {
    const [horas, minutos, segundos] = tempo.split(':');

    return (
        <div className="bg-night text-white py-[22px] px-7 text-center">
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#9CA1AE] mb-1.5">
                Essa oferta fecha em
            </p>

            <p className="font-display text-[44px] font-extrabold text-amber tracking-[0.02em] m-0 leading-none">
                {horas}<span className="text-[#565C6B] px-0.5">:</span>
                {minutos}<span className="text-[#565C6B] px-0.5">:</span>
                {segundos}
            </p>

            <p className="text-[12.5px] text-[#C6CAD3] mt-2 mb-0">
                {subtitulo}
            </p>
        </div>
    );
}
