import styled from 'styled-components'

export const Header = styled.div`
  text-align: center;
  margin: 0 auto;
  margin-top: 5rem;
  height: 28px
`

export const Container = styled.div`
  min-height: 80vh;
  padding: 0;
  background-color: #fff;
  align-item: center;
`

export const Card = styled.div`
  width: 800px;
  height: 350px;
  z-index: 15;
  background: #f7fbfc;
  background: #d8f0f3;
  color: black;
  border-radius: 25px;
  margin: 0 auto;
  margin-top: 2rem;
  border: 1px solid whitesmoke;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Image = styled.img`
  height: 12rem;
  width: 12rem;  
`

export const Btn = styled.button`
  box-shadow:inset 0px 1px 0px 0px #fce2c1;
  background:linear-gradient(to bottom, #ffc477 5%, #fb9e25 100%);
  background-color:#ffc477;
  border-radius:6px;
  border:1px solid #eeb44f;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:15px;
  font-weight:bold;
  padding:6px 40px;
  text-decoration:none;
  &:hover {
    background:linear-gradient(to bottom, #fb9e25 5%, #ffc477 100%);
	  background-color:#fb9e25;
  }
  &:active {
    position:relative;
	  top:1px;
  }
`

export const BtnContainer = styled.div`
  margin: 10px auto;
`

export const CardHover = styled.div`
  text-align: center;
  height: 12rem;
  width: 12rem;
  &:hover {
    box-shadow: 10px 8px 20px -2px black;
    transition: box-shadow .5s;
    cursor:pointer;
  }
`

export const CardHover2 = styled.div`
  text-align: center;
  height: 12rem;
  width: 12rem;
  border: 3px solid white;
  &:hover {
    box-shadow: 10px 8px 20px -2px black;
    transition: box-shadow .5s;
    cursor: pointer;
  }
`

export const InnerCard = styled.div`
  display: flex;
  justify-content: space-evenly
`

export const Text = styled.div`
  display: flex;
  justify-content: space-between;
  width: 368px;
  margin: 0 auto;
`