const App = (props) => (
  <div>
    <p>Hello React3!</p>
    <FancyButton>Click here</FancyButton>
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app-root'),
  () => console.log('Ready to go5'),
);
