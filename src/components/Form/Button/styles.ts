import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled(RectButton)`
  width: 100%;

  padding: 16px;
  align-items: center;
  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.shape};

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
`;