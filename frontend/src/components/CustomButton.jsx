import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@chakra-ui/react';

const CustomButton = () => {
    return (
        <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                        return (
                        <div
                            {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                            })}
                        >
                            {(() => {
                            if (!connected) {
                                return (
                                <Button onClick={openConnectModal} type="button" variant={"solid"} colorScheme='purple'>
                                    Connect
                                </Button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                <Button onClick={openChainModal} type="button" colorScheme='red' variant={"outline"}>
                                    Wrong network
                                </Button>
                                );
                            }

                            return (
                                <Button onClick={openAccountModal} type="button" bgColor="#C689C6" _hover={{"backgroundColor": "#EBC7E8"}}>
                                    {account.displayBalance
                                    ? ` (${account.displayBalance})`
                                    : ''}
                                    
                                </Button>
                            );
                            })()}
                        </div>
                        );
                    }}
                </ConnectButton.Custom>
    );
}

export default CustomButton;