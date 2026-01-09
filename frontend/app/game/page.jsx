"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import "./App.css";
import "./Poker.css";

import Spinner from "./Spinner";
import WinScreen from "./WinScreen";

import Player from "../components/player/Player";
import ShowdownPlayer from "../components/player/ShowdownPlayer";
import Card from "../components/card/Card";

import {
  generateDeckOfCards,
  shuffle,
  dealPrivateCards,
} from "../utils/cards.js";

import { generateTable, beginNextRound, checkWin } from "../utils/players.js";

import {
  determineBlindIndices,
  anteUpBlinds,
  determineMinBet,
  handleBet,
  handleFold,
} from "../utils/bet.js";

import { handleAI as handleAIUtil } from "../utils/ai.js";

import {
  renderShowdownMessages,
  renderActionButtonText,
  renderNetPlayerEarnings,
  renderActionMenu,
} from "../utils/ui.js";

import { cloneDeep } from "lodash";

const initialState = {
  loading: true,
  winnerFound: null,
  players: null,
  numPlayersActive: null,
  numPlayersFolded: null,
  numPlayersAllIn: null,
  activePlayerIndex: null,
  dealerIndex: null,
  blindIndex: null,
  deck: null,
  communityCards: [],
  pot: null,
  highBet: null,
  betInputValue: null,
  sidePots: [],
  minBet: 20,
  phase: "loading",
  playerHierarchy: [],
  showDownMessages: [],
  playActionMessages: [],
  playerAnimationSwitchboard: {
    0: { isAnimating: false, content: null },
    1: { isAnimating: false, content: null },
    2: { isAnimating: false, content: null },
    3: { isAnimating: false, content: null },
    4: { isAnimating: false, content: null },
    5: { isAnimating: false, content: null },
  },
};

export default function PokerGame() {
  const [gameState, setGameState] = useState(initialState);

  // Push animation state
  const pushAnimationState = useCallback((index, content) => {
    setGameState((prevState) => ({
      ...prevState,
      playerAnimationSwitchboard: {
        ...prevState.playerAnimationSwitchboard,
        [index]: { isAnimating: true, content },
      },
    }));
  }, []);

  // Pop animation state
  const popAnimationState = useCallback((index) => {
    setGameState((prevState) => {
      const persistContent =
        prevState.playerAnimationSwitchboard[index].content;
      return {
        ...prevState,
        playerAnimationSwitchboard: {
          ...prevState.playerAnimationSwitchboard,
          [index]: { isAnimating: false, content: persistContent },
        },
      };
    });
  }, []);

  // Handle bet input change
  const handleBetInputChange = useCallback((val, min, max) => {
    if (val === "") val = min;
    if (val > max) val = max;
    setGameState((prevState) => ({
      ...prevState,
      betInputValue: parseInt(val, 10),
    }));
  }, []);

  // Change slider input
  const changeSliderInput = useCallback((val) => {
    setGameState((prevState) => ({
      ...prevState,
      betInputValue: val[0],
    }));
  }, []);

  // Handle AI action
  const handleAIAction = useCallback(() => {
    setGameState((prevState) => {
      const newState = handleAIUtil(cloneDeep(prevState), pushAnimationState);

      return {
        ...newState,
        betInputValue: newState.minBet,
      };
    });
  }, [pushAnimationState]);

  // Handle bet submission
  const handleBetInputSubmit = useCallback(
    (bet, min, max) => {
      setGameState((prevState) => {
        const { activePlayerIndex } = prevState;
        pushAnimationState(
          activePlayerIndex,
          `${renderActionButtonText(
            prevState.highBet,
            prevState.betInputValue,
            prevState.players[activePlayerIndex]
          )} ${bet > prevState.players[activePlayerIndex].bet ? bet : ""}`
        );

        const newState = handleBet(
          cloneDeep(prevState),
          parseInt(bet, 10),
          parseInt(min, 10),
          parseInt(max, 10)
        );

        // Schedule AI action if needed
        if (
          newState.players[newState.activePlayerIndex].robot &&
          newState.phase !== "showdown"
        ) {
          setTimeout(() => {
            handleAIAction();
          }, 1200);
        }

        return newState;
      });
    },
    [pushAnimationState, handleAIAction]
  );

  // Handle fold
  const handleFoldAction = useCallback(() => {
    setGameState((prevState) => {
      const newState = handleFold(cloneDeep(prevState));

      if (
        newState.players[newState.activePlayerIndex].robot &&
        newState.phase !== "showdown"
      ) {
        setTimeout(() => {
          handleAIAction();
        }, 1200);
      }

      return newState;
    });
  }, [handleAIAction]);

  // Run game loop
  const runGameLoop = useCallback(() => {
    setGameState((prevState) => {
      const newState = dealPrivateCards(cloneDeep(prevState));

      if (
        newState.players[newState.activePlayerIndex].robot &&
        newState.phase !== "showdown"
      ) {
        setTimeout(() => {
          handleAIAction();
        }, 1200);
      }

      return newState;
    });
  }, [handleAIAction]);

  // Handle next round
  const handleNextRound = useCallback(() => {
    setGameState((prevState) => {
      const newState = beginNextRound(cloneDeep(prevState));

      // Check win condition
      if (checkWin(newState.players)) {
        return {
          ...newState,
          winnerFound: true,
        };
      }

      // Schedule AI action if needed
      if (
        newState.players[newState.activePlayerIndex].robot &&
        newState.phase !== "showdown"
      ) {
        setTimeout(() => {
          handleAIAction();
        }, 1200);
      }

      return newState;
    });
  }, [handleAIAction]);

  // Initialize game on mount
  useEffect(() => {
    const initializeGame = async () => {
      const players = await generateTable();
      const dealerIndex = Math.floor(
        Math.random() * Math.floor(players.length)
      );
      const blindIndicies = determineBlindIndices(dealerIndex, players.length);
      const playersBoughtIn = anteUpBlinds(
        players,
        blindIndicies,
        initialState.minBet
      );

      // Preload image using Image API instead of XMLHttpRequest
      const img = new window.Image();
      img.onload = () => {
        console.log("Image Loaded!");
        setGameState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      };
      img.onerror = () => {
        console.error("Image failed to load");
        setGameState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      };
      img.src = "/assets/table-nobg-svg-01.svg";

      setGameState((prevState) => ({
        ...prevState,
        players: playersBoughtIn,
        numPlayersActive: players.length,
        numPlayersFolded: 0,
        numPlayersAllIn: 0,
        activePlayerIndex: dealerIndex,
        dealerIndex,
        blindIndex: {
          big: blindIndicies.bigBlindIndex,
          small: blindIndicies.smallBlindIndex,
        },
        deck: shuffle(generateDeckOfCards()),
        pot: 0,
        highBet: prevState.minBet,
        betInputValue: prevState.minBet,
        phase: "initialDeal",
      }));
    };

    initializeGame().then(() => {
      setTimeout(() => {
        setGameState((prevState) => {
          const newState = dealPrivateCards(cloneDeep(prevState));

          if (
            newState.players[newState.activePlayerIndex].robot &&
            newState.phase !== "showdown"
          ) {
            setTimeout(() => {
              handleAIAction();
            }, 1200);
          }

          return newState;
        });
      }, 100);
    });
  }, [handleAIAction]);

  // Render board
  const renderBoard = () => {
    const {
      players,
      activePlayerIndex,
      dealerIndex,
      clearCards,
      phase,
      playerAnimationSwitchboard,
    } = gameState;

    if (!players) return null;

    const reversedPlayers = players.reduce((result, player, index) => {
      const isActive = index === activePlayerIndex;
      const hasDealerChip = index === dealerIndex;

      result.unshift(
        <Player
          key={index}
          arrayIndex={index}
          isActive={isActive}
          hasDealerChip={hasDealerChip}
          player={player}
          clearCards={clearCards}
          phase={phase}
          playerAnimationSwitchboard={playerAnimationSwitchboard}
          endTransition={popAnimationState}
        />
      );
      return result;
    }, []);

    return reversedPlayers;
  };

  // Render community cards
  const renderCommunityCards = (purgeAnimation = false) => {
    return gameState.communityCards.map((card, index) => {
      const cardData = { ...card };
      if (purgeAnimation) {
        cardData.animationDelay = 0;
      }
      return <Card key={index} cardData={cardData} />;
    });
  };

  // Render rank tie
  const renderRankTie = (rankSnapshot) => {
    return rankSnapshot.map((player) => {
      return renderRankWinner(player);
    });
  };

  // Render rank winner
  const renderRankWinner = (player) => {
    const { name, bestHand, handRank } = player;
    const playerStateData = gameState.players.find(
      (statePlayer) => statePlayer.name === name
    );

    return (
      <div className="showdown-player--entity" key={name}>
        <ShowdownPlayer
          name={name}
          avatarURL={playerStateData.avatarURL}
          cards={playerStateData.cards}
          roundEndChips={playerStateData.roundEndChips}
          roundStartChips={playerStateData.roundStartChips}
        />
        <div className="showdown-player--besthand--container">
          <h5 className="showdown-player--besthand--heading">Best Hand</h5>
          <div
            className="showdown-player--besthand--cards"
            style={{ alignItems: "center" }}
          >
            {bestHand.map((card, index) => {
              const cardData = { ...card, animationDelay: 0 };
              return <Card key={index} cardData={cardData} />;
            })}
          </div>
        </div>
        <div className="showdown--handrank">{handRank}</div>
        {renderNetPlayerEarnings(
          playerStateData.roundEndChips,
          playerStateData.roundStartChips
        )}
      </div>
    );
  };

  // Render best hands
  const renderBestHands = () => {
    const { playerHierarchy } = gameState;

    return playerHierarchy.map((rankSnapshot, idx) => {
      const tie = Array.isArray(rankSnapshot);
      return (
        <div key={idx}>
          {tie ? renderRankTie(rankSnapshot) : renderRankWinner(rankSnapshot)}
        </div>
      );
    });
  };

  // Render action buttons
  const renderActionButtons = () => {
    const { highBet, players, activePlayerIndex, phase, betInputValue } =
      gameState;

    if (!players || players[activePlayerIndex].robot || phase === "showdown") {
      return null;
    }

    const min = determineMinBet(
      highBet,
      players[activePlayerIndex].chips,
      players[activePlayerIndex].bet
    );
    const max =
      players[activePlayerIndex].chips + players[activePlayerIndex].bet;

    return (
      <div className="action-buttons--container">
        <button
          className="action-button"
          onClick={() => handleBetInputSubmit(betInputValue, min, max)}
        >
          {renderActionButtonText(
            highBet,
            betInputValue,
            players[activePlayerIndex]
          )}
        </button>
        <button className="fold-button" onClick={() => handleFoldAction()}>
          Fold
        </button>
      </div>
    );
  };

  // Render showdown
  const renderShowdown = () => {
    return (
      <div className="showdown-container--wrapper">
        <h5 className="showdown-container--title">Round Complete!</h5>
        <div className="showdown-container--messages">
          {renderShowdownMessages(gameState.showDownMessages)}
        </div>
        <h5 className="showdown-container--community-card-label">
          Community Cards
        </h5>
        <div className="showdown-container--community-cards">
          {renderCommunityCards(true)}
        </div>
        <button
          className="showdown--nextRound--button"
          onClick={() => handleNextRound()}
        >
          Next Round
        </button>
        {renderBestHands()}
      </div>
    );
  };

  // Render game
  const renderGame = () => {
    const { highBet, players, activePlayerIndex, phase } = gameState;

    return (
      <div className="poker-app--background">
        <div className="poker-table--container">
          <Image
            className="poker-table--table-image"
            src="/assets/table-nobg-svg-01.svg"
            alt="Poker Table"
            width={600}
            height={600}
            priority
          />
          {players && renderBoard()}
          <div className="community-card-container">
            {renderCommunityCards()}
          </div>
          <div className="pot-container">
            <Image
              style={{ height: 55, width: 55 }}
              src="/assets/pot.svg"
              alt="Pot Value"
              width={55}
              height={55}
            />
            <h4> {`${gameState.pot}`} </h4>
          </div>
        </div>
        {gameState.phase === "showdown" && renderShowdown()}
        <div className="game-action-bar">
          <div className="action-buttons">{renderActionButtons()}</div>
          <div className="slider-boi">
            {!gameState.loading &&
              renderActionMenu(
                highBet,
                players,
                activePlayerIndex,
                phase,
                handleBetInputChange
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="poker-table--wrapper">
        {gameState.loading ? (
          <Spinner />
        ) : gameState.winnerFound ? (
          <WinScreen />
        ) : (
          renderGame()
        )}
      </div>
    </div>
  );
}
