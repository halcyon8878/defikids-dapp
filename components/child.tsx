import { BigNumber, ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { IChild } from "../services/contract";
import { IStake, IStakeDuration } from "../services/stake";
import { getUSDCXBalance } from "../services/usdcx_contract";
// import Allocation from "./allocation";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosMore } from "react-icons/io";
import { trimAddress } from "@/lib/web3";
import { ChildDetails, FamilyDetails } from "@/dataSchema/hostContract";

import {
  Box,
  Flex,
  Button,
  Text,
  useBreakpointValue,
  Badge,
  ButtonGroup,
  Container,
  Tooltip,
  useToast,
  Heading,
  Image,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";

// interface IProps extends IChild {
//   details: {
//     totalCreatedStakes: BigNumber;
//     totalInvested: BigNumber;
//     totalRewards: BigNumber;
//   };
//   stakes: IStake[];
//   onTransfer: () => void;
//   onStream: () => void;
// }

export const MOCK_ALLOCATIONS = [
  {
    name: "Playstation 5",
    value: 180,
    duration: 10,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
  {
    name: "New Science Book",
    value: 25,
    duration: 4,
    durationTotal: IStakeDuration.WEEK,
  },
  {
    name: "College fund",
    value: 120,
    duration: 2,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
  {
    name: "Drone",
    value: 200,
    duration: 1,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
];

// username: string;
// avatarURI: string;
// familyId: string;
// memberSince: number;
// wallet: string;
// sandboxMode: boolean;
// isActive: boolean;
const Child = ({
  username,
  avatarURI,
  familyId,
  memberSince,
  wallet,
  sandboxMode,
  isActive,
  stakes = [],
  onOpen,
  setSelectedChild,
  childDetails,
}: {
  username: string;
  avatarURI: string;
  familyId: string;
  memberSince: number;
  wallet: string;
  sandboxMode: boolean;
  isActive: boolean;
  stakes: IStake[];
  onOpen: () => void;
  setSelectedChild: (childDetails: ChildDetails) => void;
  childDetails: ChildDetails;
}) => {
  const toast = useToast();
  const [balance, setBalance] = useState(0);
  // useEffect(() => {
  //   if (!provider || !_address) {
  //     return;
  //   }
  //   getUSDCXBalance(provider, _address).then((value) => {
  //     setBalance(parseFloat(value));
  //   });
  // }, [provider, _address]);

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const stakesToShow = useMemo(
    () => stakes.filter((s) => s.remainingDays >= 0),
    [stakes]
  );

  return (
    <Flex
      pb={6}
      alignItems="center"
      direction="column"
      onClick={() => {
        setSelectedChild(childDetails);
        onOpen();
      }}
      _hover={{
        transform: "scale(1.05)",
      }}
      style={{
        cursor: "pointer",
      }}
    >
      <Avatar
        mt={1}
        size="2xl"
        name="Defi Kids"
        src={avatarURI ? avatarURI : "/images/placeholder-avatar.jpeg"}
      />

      <Box>
        {/* Username */}
        <Flex mb={2}>
          <Text>{username ? username : trimAddress(wallet)}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Child;
