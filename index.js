function typeToObject(arg) {
  return { type: arg };
}
function generateABIArgumentValue(sig) {
  if (
    sig.indexOf(",") === -1 &&
    sig[0] !== "(" &&
    sig[sig.length - 1] !== ")"
  ) {
    return sig;
  }
  const k = [];
  let buffer = "";
  if (sig[0] === "(") {
    return generateABIArgumentValue(sig.slice(1, -1));
  } else if (sig.indexOf(",") !== -1) {
    let i = 0;
    do {
      const c = sig[i];
      buffer += c;
      switch (sig[i]) {
        case ",":
          k.push(buffer.slice(0, -1));
          buffer = "";
          break;
        default:
          break;
        case "(":
          const b = generateABIArgument(sig.slice(i));
          k.push(generateABIArgumentValue(b));
          i += b.length;
          buffer = "";
          break;
        case ")":
          break;
      }
      i++;
    } while (i < sig.length);
  }
  if (buffer.length > 0) k.push(buffer);
  return k;
}
function generateABIArgument(sig) {
  if (sig[0] !== "(") return sig;
  let buffer = "";
  let d = 0;
  let i = 0;
  do {
    const c = sig[i];
    buffer += c;
    switch (sig[i]) {
      default:
        break;
      case "(":
        d++;
        break;
      case ")":
        d--;
        break;
    }
    i++;
  } while (d > 0);
  return buffer;
}
function generateABIMethod(sig) {
  let functionNameIndex = sig.indexOf("(");
  let functionName = sig.slice(0, functionNameIndex);
  const args = generateABIArgument(sig.slice(functionNameIndex));
  const returnsType = generateABIArgument(
    sig.slice(functionName.length + args.length)
  );
  const methodArgs =
    args === "()"
      ? []
      : ((a) =>
          Array.isArray(a)
            ? a
                .map((b) => (Array.isArray(b) ? `(${b.join(",")})` : b))
                .map(typeToObject)
            : [a].map(typeToObject))(generateABIArgumentValue(args));
  const method = {
    name: functionName,
    args: methodArgs,
    returns: { type: returnsType },
  };
  return method;
}
const generateABIEvent = (eventTy) => {
  const events = Object.entries(eventTy).map(([k, v]) => ({
    name: k,
    args: v.map((a) => ({ type: a.toString() })),
  }));
  return events;
};
function defaultTemplate() {
  const abi = {
    name: "YourContractName",
    desc: "Description of your contract",
    methods: [],
    events: [],
  };
  return abi;
}
async function generateABI(ctc, template = defaultTemplate) {
  const { sigs } = await ctc.getABI(true);
  const eventTys = await ctc.getEventTys();
  const readonlyMethods = Object.keys(ctc.unsafeViews);
  const abi = template();
  sigs.forEach((sig) => {
    const method = generateABIMethod(sig);
    if (readonlyMethods.includes(method.name)) {
      method.readonly = true;
    }
    abi.methods.push(method);
  });
  abi.events = generateABIEvent(eventTys);
  return abi;
}
module.exports = {
  generateABI,
};
