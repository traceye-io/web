import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { Discount } from 'apps/web/pages/names';
import { Icon } from 'apps/web/src/components/Icon/Icon';
import { useRegisterNameCallback } from 'apps/web/src/utils/hooks/useRegisterNameCallback';
import { useCallback, useState } from 'react';
import { base, baseSepolia } from 'viem/chains';
import { useSwitchChain } from 'wagmi';

type RegistrationFormProps = {
  name: string;
  loadingDiscounts: boolean;
  toggleModal: () => void;
  discount: number;
  hasDiscount: (d: number) => boolean;
};

export function RegistrationForm({
  discount,
  hasDiscount,
  name,
  loadingDiscounts,
  toggleModal,
}: RegistrationFormProps) {
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const [years, setYears] = useState(1);
  const increment = useCallback(() => {
    setYears((n) => n + 1);
  }, []);
  const decrement = useCallback(() => {
    setYears((n) => (n > 1 ? n - 1 : n));
  }, []);

  const switchChainToBase = useCallback(() => {
    switchChain({ chainId: base.id });
  }, []);

  const registerName = useRegisterNameCallback(name, years);

  const buttonClasses = 'text-xl rounded-full py-3 px-8 text-illoblack bg-gray/10 border-line/20';
  const nameIsFree = !hasDiscount(Discount.NONE) && !hasDiscount(Discount.ALREADY_REDEEMED);
  return (
    <div className="mx-auto w-full max-w-[50rem] transition-all duration-500">
      <div className="z-10 mx-4 flex flex-col justify-between gap-4 rounded-xl border border-line/20 bg-[#F7F7F7] p-6 text-gray/60 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-sm uppercase">Claim for</p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={decrement}
              disabled={years === 1}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray/10"
            >
              <MinusIcon width="12" height="12" className="fill-gray/80" />
            </button>
            <span className="flex w-32 items-center justify-center text-3xl text-black">
              {years} year{years > 1 && 's'}
            </span>
            <button
              type="button"
              onClick={increment}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray/10"
            >
              <PlusIcon width="12" height="12" className="fill-gray/80" />
            </button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm uppercase">Amount</p>
          <div className="flex items-baseline justify-center md:justify-between">
            <p className="mx-2 whitespace-nowrap text-3xl text-black">
              {loadingDiscounts ? '...' : '0.01'} ETH
            </p>
            {loadingDiscounts ? (
              <div className="flex h-4 items-center justify-center">
                <Icon name="spinner" color="currentColor" />
              </div>
            ) : (
              <span className="whitespace-nowrap text-xl text-gray/60">${3.82}</span>
            )}
          </div>
        </div>

        <ConnectButton.Custom>
          {({ account, chain, openChainModal, mounted }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            if (!connected) {
              return (
                <button type="button" className={buttonClasses} onClick={openConnectModal}>
                  Connect wallet
                </button>
              );
            }

            if (!([base.id, baseSepolia.id] as number[]).includes(chain.id)) {
              return (
                <button onClick={switchChainToBase} type="button" className={buttonClasses}>
                  Switch network
                </button>
              );
            }

            return (
              <button onClick={registerName} className={buttonClasses} type="button">
                Register name
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
      <div className="mt-6 flex w-full justify-center">
        <p className="mr-2 text-center text-lg uppercase text-line">
          {nameIsFree ? "You've qualified for a free name! " : 'Unlock your username for free! '}
        </p>
        <button
          type="button"
          className="text-lg uppercase text-line underline"
          onClick={toggleModal}
        >
          learn more
        </button>
      </div>
    </div>
  );
}
