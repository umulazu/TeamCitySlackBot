export default obj =>
    Object.entries(obj).length === 0 && obj.constructor === Object;
