import crypto from "crypto";

export function extrairPartesAssinatura(xSignature: string): { ts: string; v1: string } {
  let ts = "";
  let v1 = "";

  const parts = xSignature.split(',');
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key === 'ts') ts = value;
    if (key === 'v1') v1 = value;
  });

  return { ts, v1 };
}


export function calcularAssinaturaEsperada(dataId: string, xRequestId: string, ts: string, secret: string): string {
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  return hmac.digest("hex");
}


export function verificarAssinaturaMercadoPago({
  dataId,
  xRequestId,
  xSignature,
  secret,
}: {
  dataId: string;
  xRequestId: string;
  xSignature: string;
  secret: string;
}): boolean {
  if (!xSignature || !xRequestId || !dataId) return false;

  const { ts, v1 } = extrairPartesAssinatura(xSignature);
  if (!ts || !v1) return false;

  const calculatedSignature = calcularAssinaturaEsperada(dataId, xRequestId, ts, secret);

  return calculatedSignature === v1;
}
