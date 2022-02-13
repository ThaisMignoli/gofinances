import styled, { css } from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons"
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
  type: 'up' | 'down';
}

interface ContainerProps {
  isActive: boolean;
  type: 'up' | 'down';
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row; 
  width: 48%;
  
  border-width: ${( {isActive }) => isActive? 0: 1.5}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: 5px;

  ${( {isActive, type }) => isActive && type === 'down' && css`
    background: ${({ theme }) => theme.colors.attention_light};
  `};

  ${( {isActive, type }) => isActive && type === 'up' && css`
    background-color: ${({ theme }) => theme.colors.sucess_light};
  `};
`;

export const Button = styled(RectButton)`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 16px;
`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;

  color: ${({ theme, type }) => 
    type === 'up' ? theme.colors.sucess : theme.colors.attention
  }
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.title};

  margin-left: 12px;
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular}
`;