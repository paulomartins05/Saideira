import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  extrairPartesAssinatura,
  calcularAssinaturaEsperada,
  verificarAssinaturaMercadoPago,
} from "@/lib/mercadopago-signature";

const SECRET = "segredo-de-teste-123";

function assinar(dataId: string, xRequestId: string, ts: string, secret = SECRET) {
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const v1 = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return `ts=${ts},v1=${v1}`;
}

describe("extrairPartesAssinatura()", () => {
  it("separa ts e v1 de um cabeçalho real do Mercado Pago", () => {
    const partes = extrairPartesAssinatura("ts=1700000000,v1=abcdef123456");
    expect(partes).toEqual({ ts: "1700000000", v1: "abcdef123456" });
  });

  it("funciona independente da ordem das partes", () => {
    const partes = extrairPartesAssinatura("v1=abcdef123456,ts=1700000000");
    expect(partes).toEqual({ ts: "1700000000", v1: "abcdef123456" });
  });

  it("retorna vazio quando falta uma das partes", () => {
    const partes = extrairPartesAssinatura("ts=1700000000");
    expect(partes.v1).toBe("");
  });
});

describe("verificarAssinaturaMercadoPago()", () => {
  it("aceita uma notificação legítima, assinada com o segredo certo", () => {
    const xSignature = assinar("123456", "req-abc", "1700000000");
    const valido = verificarAssinaturaMercadoPago({
      dataId: "123456",
      xRequestId: "req-abc",
      xSignature,
      secret: SECRET,
    });
    expect(valido).toBe(true);
  });

  it("rejeita quando o dataId foi trocado depois da assinatura ser calculada", () => {
    const xSignature = assinar("123456", "req-abc", "1700000000");
    const valido = verificarAssinaturaMercadoPago({
      dataId: "999999",
      xRequestId: "req-abc",
      xSignature,
      secret: SECRET,
    });
    expect(valido).toBe(false);
  });

  it("rejeita quando o x-request-id foi adulterado", () => {
    const xSignature = assinar("123456", "req-abc", "1700000000");
    const valido = verificarAssinaturaMercadoPago({
      dataId: "123456",
      xRequestId: "req-outro",
      xSignature,
      secret: SECRET,
    });
    expect(valido).toBe(false);
  });

  it("rejeita quando o segredo usado pra verificar é diferente do usado pra assinar", () => {
    const xSignature = assinar("123456", "req-abc", "1700000000", "segredo-diferente");
    const valido = verificarAssinaturaMercadoPago({
      dataId: "123456",
      xRequestId: "req-abc",
      xSignature,
      secret: SECRET,
    });
    expect(valido).toBe(false);
  });

  it("rejeita um cabeçalho de assinatura malformado sem lançar exceção", () => {
    const valido = verificarAssinaturaMercadoPago({
      dataId: "123456",
      xRequestId: "req-abc",
      xSignature: "isso-nao-e-um-x-signature-valido",
      secret: SECRET,
    });
    expect(valido).toBe(false);
  });

  it("rejeita string vazia de assinatura sem lançar exceção", () => {
    expect(() =>
      verificarAssinaturaMercadoPago({
        dataId: "123456",
        xRequestId: "req-abc",
        xSignature: "",
        secret: SECRET,
      })
    ).not.toThrow();
  });
});

describe("calcularAssinaturaEsperada()", () => {
  it("é determinística: os mesmos dados sempre geram a mesma assinatura", () => {
    const a = calcularAssinaturaEsperada("1", "r1", "1700000000", SECRET);
    const b = calcularAssinaturaEsperada("1", "r1", "1700000000", SECRET);
    expect(a).toBe(b);
  });

  it("qualquer mudança num dos campos muda a assinatura inteira", () => {
    const original = calcularAssinaturaEsperada("1", "r1", "1700000000", SECRET);
    const comTsDiferente = calcularAssinaturaEsperada("1", "r1", "1700000001", SECRET);
    expect(original).not.toBe(comTsDiferente);
  });
});
