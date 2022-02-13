import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

export const Container = styled(RectButton).attrs({
  activeOpacity: 0.7
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  padding: 18px 16px;

  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;
`;

export const Category = styled.Text`
  color: ${({ theme }) => theme.colors.text};

  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular}
`;
export const Icon = styled(Feather)`
  color: ${({ theme }) => theme.colors.text};

  font-size: ${RFValue(20)}px;
`;