interface JornadaProps {
    resgatesAtuais: number;
}

export function JornadaUsuario({ resgatesAtuais }: JornadaProps) {
    const marcos = [1, 5, 14, 25, 50];

    return (
        <div className="flex items-center my-[22px] mx-0 overflow-x-auto pb-1.5">
            {marcos.map((marco, index) => {
                const isDone = resgatesAtuais > marco;
                const isActive = resgatesAtuais === marco;
                const isLast = index === marcos.length - 1;

                return (
                    <div key={marco} className="flex items-center shrink-0">
                        <div className="flex flex-col items-center gap-2 w-[110px] text-center">
                            <div className={`rounded-full border-[3px] border-card transition-all ${isActive ? 'w-[18px] h-[18px] bg-night shadow-[0_0_0_3px] shadow-amber' :
                                isDone ? 'w-4 h-4 bg-amber shadow-[0_0_0_2px] shadow-amber' :
                                    'w-4 h-4 bg-line shadow-[0_0_0_2px] shadow-line'
                                }`} />
                            <p className={`text-[11px] m-0 ${isActive ? 'text-night font-extrabold' :
                                'text-muted font-semibold'
                                }`}>
                                {marco === 1 ? '1º resgate' : `${marco} resgates`}
                                <br />
                                {isActive && <span className="text-[10px]">você está aqui</span>}
                            </p>
                        </div>

                        {!isLast && (
                            <div className={`h-[2px] min-w-[24px] flex-1 ${resgatesAtuais >= marcos[index + 1] ? 'bg-amber' : 'bg-line'
                                }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
