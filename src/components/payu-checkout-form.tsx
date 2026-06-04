"use client";

import { useEffect, useRef } from "react";
import type { PayuPaymentStartResponse } from "@/services/subscriptionService";

type PayuCheckoutFormProps = {
  checkout: PayuPaymentStartResponse;
};

/** Envía POST automático al Web Checkout PayU Latam. */
export function PayuCheckoutForm({ checkout }: PayuCheckoutFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { actionUrl, fields } = checkout;

  useEffect(() => {
    formRef.current?.submit();
  }, [checkout]);

  return (
    <form ref={formRef} method="POST" action={actionUrl} className="hidden">
      <input type="hidden" name="merchantId" value={fields.merchantId} />
      <input type="hidden" name="accountId" value={fields.accountId} />
      <input type="hidden" name="description" value={fields.description} />
      <input type="hidden" name="referenceCode" value={fields.referenceCode} />
      <input type="hidden" name="amount" value={fields.amount} />
      <input type="hidden" name="tax" value={fields.tax} />
      <input type="hidden" name="taxReturnBase" value={fields.taxReturnBase} />
      <input type="hidden" name="currency" value={fields.currency} />
      <input type="hidden" name="signature" value={fields.signature} />
      <input type="hidden" name="test" value={String(fields.test)} />
      <input type="hidden" name="buyerEmail" value={fields.buyerEmail} />
      <input type="hidden" name="buyerFullName" value={fields.buyerFullName} />
      <input type="hidden" name="telephone" value={fields.telephone} />
      <input type="hidden" name="responseUrl" value={fields.responseUrl} />
      <input type="hidden" name="confirmationUrl" value={fields.confirmationUrl} />
      <input
        type="hidden"
        name="algorithmSignature"
        value={fields.algorithmSignature}
      />
      <input type="hidden" name="keyPublic" value={fields.keyPublic} />
    </form>
  );
}
