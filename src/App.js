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
	button {
		display: block;
		margin: auto;
	}
`;
const RemainingCardsDiv = styled.div`
	height: 30px;
	width: 100%;
`;

function App() {
	const [deckData, setDeckData] = useState();
	const [currentCardData, setCurrentCardData] = useState();
	const [previousCardData, setpreviousCardData] = useState();
	let score = 0;
	const StartGame = async () => {
		try {
			const res = await axios.get(
				`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
			);
			setDeckData(res.data);
		} catch (error) {
			console.log(error);
		}
	};
	const DrawACard = async () => {
		try {
			const res = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=1`
			);
			console.log(res);
			setCurrentCardData(res.data.cards[0]);
			setDeckData({ ...res.data });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		StartGame().then(() => {
			DrawACard();
		});
	}, []);
	const PredictLower = () => {
		setpreviousCardData(currentCardData);
		DrawACard().then(() => {
			score = currentCardData.value;
		});
	};

	return (
		<PageWrapper className='page_wrapper'>
			{!deckData ? (
				<button onClick={StartGame}> Start Game</button>
			) : (
				<>
					<RemainingCardsDiv>
						{deckData
							? `There are ${deckData.remaining} cards remaining`
							: null}
					</RemainingCardsDiv>
					{currentCardData ? <img src={currentCardData.image} /> : null}

					<button onClick={PredictLower}>Next card lower</button>
					<button>Next card higher</button>
					<span>{previousCardData ? previousCardData.value : null}</span>
				</>
			)}
		</PageWrapper>
	);
}

export default App;
