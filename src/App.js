import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
const PageWrapper = styled.section`
	height: 100vh;
	padding: 30px;
	text-align: center;
	img {
		width: 300px;
	}
`;
const RemainingCardsDiv = styled.div`
	width: 100%;
`;
const PreviousCardsDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	img {
		width: 100px;
	}
	span {
		height: 30px;
	}
`;
const ButtonsDiv = styled.div`
	button {
		display: block;
		margin: auto;
		height: 40px;
		width: 200px;
		border: 0;
		background-color: #e2e2e2;
		border-radius: 6px;
		outline: none !important;
		cursor: pointer;
		font-size: 16px;
		&:hover {
			background-color: #c6d6d8;
			border-radius: 6px;
		}
	}
`;
const UpDownButtonsDiv = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	margin-top: 60px;
	height: 169px;
`;
const RestartButtonsDiv = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	margin-top: 60px;
`;
function App() {
	const [deckData, setDeckData] = useState();
	const [currentCardData, setCurrentCardData] = useState();
	const [previousCardData, setpreviousCardData] = useState();
	const [score, setScore] = useState(0);
	const [predictType, setPredict] = useState();

	const StartGame = () => {
		axios
			.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
			.then((response) => {
				return DrawACard(response.data.deck_id);
			})
			.catch((error) => console.log(error));
	};
	const DrawACard = async (deckId) => {
		try {
			const res = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
			);
			setCurrentCardData(res.data.cards[0]);
			setDeckData({ ...res.data });
			return res;
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		StartGame();
	}, []);

	useEffect(() => {
		if (!deckData) return;
		DrawACard(deckData.deck_id).then((res) => {
			if (res) {
				console.log(res.data);
				const cardDrawn = calculateValueForFaceCards(res.data.cards[0].value);

				if (
					(predictType === 'low' && cardDrawn <= previousCardData.value) ||
					(predictType === 'high' && cardDrawn >= previousCardData.value)
				)
					setScore(score + 1);
			}
		});
	}, [previousCardData, predictType]);

	const calculateValueForFaceCards = (value) => {
		switch (value) {
			case 'QUEEN':
				return 12;
			case 'KING':
				return 13;
			case 'JACK':
				return 11;
			case 'ACE':
				return 14;
			default:
				return value;
		}
	};

	return (
		<PageWrapper className='page_wrapper'>
			{deckData ? (
				<>
					<RemainingCardsDiv>
						{deckData
							? `There are ${deckData.remaining} cards remaining`
							: null}
						<h1>{`Current Score: ${score}`}</h1>
					</RemainingCardsDiv>
					{currentCardData ? <img src={currentCardData.image} /> : null}
					{deckData.remaining > 0 ? (
						<ButtonsDiv>
							<UpDownButtonsDiv>
								<button
									onClick={() => {
										setpreviousCardData(currentCardData);
										setPredict('low');
									}}
								>
									Next card is lower
								</button>
								<PreviousCardsDiv>
									<span>{previousCardData ? `Previous card was` : null}</span>
									{previousCardData ? (
										<img src={previousCardData.image} />
									) : null}
								</PreviousCardsDiv>
								<button
									onClick={() => {
										setpreviousCardData(currentCardData);
										setPredict('high');
									}}
								>
									Next card is higher
								</button>
							</UpDownButtonsDiv>
						</ButtonsDiv>
					) : (
						<ButtonsDiv>
							<RestartButtonsDiv>
								<button onClick={StartGame}> Restart Game</button>
							</RestartButtonsDiv>
						</ButtonsDiv>
					)}
				</>
			) : null}
		</PageWrapper>
	);
}

export default App;
