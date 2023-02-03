<script lang="ts">
  import type { MountProps } from '@norce/module-adapter-svelte';
  import { Events, type DiscountData } from '@norce/checkout-lib';
  import { onMount } from 'svelte';
  import { culture, t } from './translations';
  import { createFormatter } from '@norce/checkout-lib';

  export let api: MountProps['api'];
  export let data: MountProps['data'];
  export let EventEmitter: MountProps['EventEmitter'];

  let formEl: HTMLFormElement;
  const formatter = createFormatter(data.order.culture, data.order.currency);

  onMount(() => {
    culture.set(data.order.culture);
  });

  const handleSubmit = (
    e: Event & {
      readonly submitter: HTMLElement;
    } & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) => {
    e.preventDefault();
    const formData = new FormData(formEl);
    const code = formData.get('discountCode') as string;
    api.applyDiscount(code);
  };

  $: submitData = api.data as DiscountData | undefined;

  $: {
    if (submitData?.ok) {
      const formData = new FormData(formEl);
      const code = formData.get('discountCode') as string;
      formEl.reset();
      EventEmitter.dispatch({
        event: Events.AddDiscount,
        payload: code,
      });
    }
  }

  $: pulsingClass =
    api.state === 'pending'
      ? 'text-transparent bg-black/20 rounded animate-pulse'
      : '';
</script>

<div class="grid gap-6 text-sm">
  <div class="flex justify-between pb-2 border-b">
    <h2>{t('Order Summary')}</h2>
  </div>

  <div class="grid gap-2 pb-2 border-b">
    <div class="flex justify-between">
      <h2>{t('Total Items')}</h2>
      <span class={pulsingClass}
        >{formatter.format(data.order.cart.total.includingVat)}</span
      >
    </div>
    <div class="flex justify-between">
      <h2>{t('Shipping')}</h2>
      {#if data.order.shippings?.length}
        <span class={pulsingClass}>
          {formatter.format(
            data.order.shippings?.[0]?.total?.includingVat || 0
          )}
        </span>
      {/if}
    </div>
    {#if data.order.cart.discounts.length}
      <div class="flex justify-between">
        <h2>{t('Discount')}</h2>
        <span class={pulsingClass}>
          &minus; {formatter.format(
            data.order.cart.discounts.reduce(
              (acc, cur) => acc + cur.value.includingVat,
              0
            )
          )}
        </span>
      </div>
    {/if}
  </div>

  <div class="flex justify-between pb-2 border-b">
    <h2>{t('Total incl. VAT')}</h2>
    <span class={pulsingClass}
      >{formatter.format(data.order.total.includingVat)}</span
    >
  </div>

  <form bind:this={formEl} on:submit={handleSubmit}>
    <label class="block mb-1" for="discountCode">
      {t('Enter Discount Code')}
    </label>
    <input
      id="discountCode"
      type="text"
      name="discountCode"
      placeholder={t('Discount Code')}
      class="w-40 py-1 border-b border-inherit placeholder:text-black/50 outline-none focus:bg-black focus:bg-opacity-[0.01]"
    />

    {#if submitData?.error}
      <span class="block">
        {submitData?.error}
      </span>
    {/if}
  </form>
</div>

<style global lang="postcss">
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
</style>
