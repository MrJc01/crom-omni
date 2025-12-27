const Counter = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Omni");

  return (
    <div>
      <h1>
        {name} Counter: {count}
      </h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
