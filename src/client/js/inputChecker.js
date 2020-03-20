function inputCheck(fromText, toText) {
  let text = /^[a-zA-Z\s]{0,255}$/;
  if (text.test(fromText) && text.test(toText)) {
    return;
  } else {
    alert("please enter a valid name");
  }
}

export { inputCheck };
