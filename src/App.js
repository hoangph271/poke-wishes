import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import "./styles.css";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default styled(function App() {
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRandomPokemon = useCallback(async () => {
    setIsLoading(true);
    const start = Date.now();

    setPokemon(await getRandomPokemon());
    await delay(1000 - (Date.now() - start));

    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const start = Date.now();

    getRandomPokemon().then(async pokemon => {
      setPokemon(pokemon);

      await delay(1000 - (Date.now() - start));
      setIsLoading(false);
    });
  }, []);
  
  useEffect(() => {
    document.title = isLoading ? '...!' : `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`;
  }, [pokemon, isLoading]);

  return (
    <div className="App">
      {isLoading ? (
        <LoadingView />
      ) : (
        <PokemonView onClick={loadRandomPokemon} pokemon={pokemon} />
      )}
    </div>
  );
})`
  min-height: 600px;
  background-color: rgba(0, 184, 148, 0.2);
`;

const nextThing = (() => {
  const things = [
    "her best of lucks",
    "may the power be with her",
    "may she keep her cool",
    "may she remain awesome",
    "may she believe in herself",
    "may she believe in @HHP"
  ];
  let current;

  return () => {
    const thing = things[parseInt(things.length * Math.random(), 10)];

    if (thing !== current) {
      current = thing;
      return thing;
    }

    return nextThing();
  };
})();
const PokemonView = styled(({ className, pokemon, onClick }) => {
  const { name, pic, wish } = pokemon;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={className}>
      <div
        className={[imageLoaded ? "tada" : "", "animated", "pic-frame"].join(
          " "
        )}
      >
        <img
          onLoad={() => setImageLoaded(true)}
          className="pic"
          onClick={onClick}
          alt={name}
          src={pic}
          style={{ visibility: imageLoaded ? "" : "hidden" }}
        />
      </div>
      <div>
        <span className="title">{`${name}...!`}</span>
        <span>{`It wishes ${wish}...!`}</span>
      </div>
    </div>
  );
})`
  .title {
    font-weight: bold;
    text-transform: capitalize;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .pic-frame {
    display: inline-flex;
    border-radius: 50%;
    padding: 1.8rem;
    box-shadow: inset 0 0 5px rgba(147, 249, 185, 0.8);
    background-image: linear-gradient(
      to top right,
      rgba(18, 194, 233, 0.6) 0%,
      rgba(29, 151, 108, 0.6) 35%,
      rgba(147, 249, 185, 0.6) 65%
    );
  }
  .pic {
    cursor: pointer;
    width: 150px;
    height: 150px;
  }
`;
const LoadingView = styled(({ className }) => {
  return (
    <div className={className}>
      <div>{`@TA is gettin' a blessing from...!`}</div>
      <Loader />
    </div>
  );
})`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Loader = styled(({ className }) => {
  return <div className={className} />;
})`
  background-position: center;
  background-size: contain;
  background-image: url(https://cantho.ecolodge.asia/images/loading.gif);
  width: 50px;
  height: 50px;
`;
const getPokemonCount = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon-species/?limit=0");

  const { count } = await res.json();

  return count;
};
const getRandomPokemon = (() => {
  let pokemonCount;

  getPokemonCount().then(count => {
    if (!pokemonCount) {
      pokemonCount = count;
    }
  });

  return async () => {
    if (!pokemonCount) {
      pokemonCount = await getPokemonCount();
    }

    const id = parseInt(Math.random() * pokemonCount, 10) + 1;

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

    const { name } = await res.json();

    const picRes = await fetch(
      `https://pokeres.bastionbot.org/images/pokemon/${id}.png`
    );

    if (!picRes.ok) {
      console.error(`https://pokeres.bastionbot.org/images/pokemon/${id}.png`);
      return await getRandomPokemon();
    }

    return {
      wish: nextThing(),
      name,
      pic: `https://pokeres.bastionbot.org/images/pokemon/${id}.png`
    };
  };
})();
