import { AddressListItem } from '../components/AddressListItem';
import { DetailedNftItem } from '../components/DetailedNftItem';
import { ActionStatusEnum } from '@tonkeeper/core/src/TonAPI';
import { ExtraListItem } from '../components/ExtraListItem';
import { ActionModalContent } from '../ActionModalContent';
import { ActionItem, ActionType } from '@tonkeeper/core';
import { Text } from '@tonkeeper/uikit';
import { memo } from 'react';
import { t } from '../../../i18n';

interface NftItemTransferActionContenttProps {
  action: ActionItem<ActionType.NftItemTransfer>;
}

export const NftItemTransferActionContent = memo<NftItemTransferActionContenttProps>(
  (props) => {
    const { action } = props;

    return (
      <ActionModalContent
        action={action}
        header={
          action.status === ActionStatusEnum.Ok ? (
            <DetailedNftItem nftAddress={action.payload.nft} />
          ) : (
            <Text type="h2">NFT</Text>
          )
        }
      >
        <AddressListItem
          destination={action.destination}
          recipient={action.payload.recipient}
          sender={action.payload.sender}
        />
        <ExtraListItem extra={action.event.extra} />
      </ActionModalContent>
    );
  },
);
