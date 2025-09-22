import styled from "styled-components";

export const Title = styled.div`
  margin-bottom: 12px;
  h1 {
    margin: 0 0 6px;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
  }
`;
