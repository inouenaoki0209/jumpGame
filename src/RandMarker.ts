export const stepColorChoiceRand =()=>{
    const randValue = 3;
    return randBase(randValue)
}

const randBase =(baseNum:number)=>{
    return  Math.floor(Math.random()*baseNum);
}