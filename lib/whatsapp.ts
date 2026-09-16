
export async function notificarParceiroWhatsApp(telefoneParceiro: string, nomeCliente: string, produto: string, pin: string) {

    const telefoneLimpo = telefoneParceiro.replace(/\D/g, '');

    if (telefoneLimpo.length < 10) {
        return
    }

    const mensagem = `🚨 *NOVO RESGATE!* 🚨
  
Olá! Você acabou de receber um novo resgate pelo *Salgado Salvo*. 🥐
👤 *Cliente:* ${nomeCliente}
📦 *Produto:* ${produto}
🔑 *PIN de Segurança:* ${pin}
Por favor, separe a sacola o quanto antes. O cliente está a caminho e informará o PIN no balcão!`

    try {

        const URL_DA_SUA_API = `https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text`;

        await fetch(URL_DA_SUA_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: telefoneLimpo,
                message: mensagem
            })
        })
    } catch (error) {
        console.error("Falha ao notificar via WhatsApp", error);

    }

}