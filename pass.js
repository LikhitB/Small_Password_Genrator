//slider
let slider = document.querySelector('.slide')
let slider1=document.querySelector('.slider')
//length
let input_text = document.querySelector('.inp-text')
let password_length=document.querySelector('.Pass_length')
let UpperCase = document.querySelector('#UpperCase')
let LowerCase = document.querySelector('#LowerCase')
let Numbers = document.querySelector('#Numbers')
let Symbols = document.querySelector('#Symbols')
// let password=document.querySelector('.password')
let password_cpy = document.querySelector('.password_cpy')
//strength
let si = document.querySelector('.strength_indicator')
let signal=document.querySelector('.signal')
//
let generate_btn = document.querySelector('.get-pswd-btn')
//checkboxes
let allcheckbox = document.querySelectorAll('input[type=checkbox]')
//copy button
let cpy_btn = document.querySelector('.btn-cpy')
let span_cpy = document.querySelector('.span-cpy')

const symbols = "!@#$%^&*()_+=}{[]|\;:'><,.?~`-"

//CODE STARTS
var p_len=10
let checkboxCount=0
var password = ""
function onSlider() {
    slider.value=p_len;
    password_length.textContent=p_len;
    slider.style.backgroundSize ="'50%' + '100%'"; 
    // let min=slider.min
    // let max=slider.max
    // slider1.style.backgroundColor="yellow"
    // slider1.style.backgroundSize=((p_len-min)*100/(max-min))+"% + 100%"
}
// slider.addEventListener('click',onSlider) 
function setIndicator(color) {
    si.style.backgroundColor = color
    // si.style.boxShadow = `0px 0px 20px 3px ${color}`
}
function getrandomInteger(min, max) {
    //default behaviour of math.random is to give numbers b/w 0-1
    //now below can give the number b/w max and min
    return Math.floor(((Math.random()) * (max - min)) + min)
}
/* 
   LOGIC IS FIRST WE ARE CAPABLE TO GENERATE RANDOM NUMBERS FORM ABOVE FUNCTION getrandomInteger()
   FROM WHICH WE CAN ACCESS ALL TYPES UPPERCASE,LOWERCASE ETC... WHICH CAN BE CONVERTED FROM ASCII \
   String.fromCharCode() --> converts ASCII value to alphabet
*/
function getRandomNumber() {
    return getrandomInteger(0, 9)
}
function getRandomUpperCase() {
    return String.fromCharCode(getrandomInteger(65, 90))
}
function getRandomLowerCase() {
    return String.fromCharCode(getrandomInteger(97, 123))
}
function generateSymbol() {
    let number = getrandomInteger(0, symbols.length)
    return symbols[number]
}
//checks the strength of the password
function calStrength() {
    let Uppercase = false
    let Lowercase = false
    let symbols = false
    let numbers = false
    if (UpperCase.checked) Uppercase = true
    if (LowerCase.checked) Lowercase = true
    if (Numbers.checked) numbers = true
    if (Symbols.checked) symbols = true
    if (((Uppercase &&numbers&&Lowercase) || (Uppercase&&Lowercase && symbols)) && (input_text.value.trim().length > 8)) {
        signal.classList.remove("strength_indicator_neutral") 
        signal.classList.add("strength_indicator_safe") 
    } 
    else if (((Uppercase || numbers) && (Lowercase || symbols)) && (input_text.value.trim().length > 8)) {
        signal.classList.add("strength_indicator_neutral") 
        signal.classList.remove("strength_indicator_bad") 
        signal.classList.remove("strength_indicator_safe")
    }
    else {
        signal.classList.add("strength_indicator_bad") 
        signal.classList.remove("strength_indicator_safe")
    }

}
//shuffle function which shuffles the password 
function shuffle_pswd(array){
    let temp
    for(let i=array.length-1;i>=0;i--){
        let j=Math.floor(Math.random()*(i))
        temp=array[i]
        array[i]=array[j]
        array[j]=temp
    }
    let x=array.join('')
    return x
}
span_cpy.innerText=''
async  function copyContent(){
    // below fn returns promise which can be resolved or rejected so the copied popup only shows when promise is resolved
    // if promise is rejected then there will be the chance of error so we keep them in try catch block
    try{
       await navigator.clipboard.writeText(input_text.value)
       span_cpy.textContent='Copied'
    }
    catch{
        span_cpy.textContent='Failed'
    }
    //adding styles
    span_cpy.classList.add('span-cpy-visible')
    setTimeout(() => {
        span_cpy.classList.remove('span-cpy-visible')
        password = inp_text.value
    }, 2000)
}
slider.addEventListener('input',(e)=>{
    p_len=e.target.value
    onSlider()
})

cpy_btn.addEventListener('click',()=>{
    if(input_text.value){
        copyContent()
    }
})
function handleCheckBox(){
    checkboxCount=0
    allcheckbox.forEach((k)=>{
        if(k.checked){
            checkboxCount++
        }
    })
    //corner condition
    if(p_len<checkboxCount){
        p_len=checkboxCount
        onSlider()
    }
}
allcheckbox.forEach((ck)=>{
    ck.addEventListener('change',handleCheckBox)
})
// password generator
generate_btn.addEventListener('click',()=>{
      document.querySelector('.outer_layer').classList.add("animate")
      if(checkboxCount>p_len){
         p_len=checkboxCount
         onSlider()
      }
      //!array created to keep record of checked ones
      let arr=[]
      if(UpperCase.checked){
         arr.push(getRandomUpperCase)
      }
      if(LowerCase.checked){
         arr.push(getRandomLowerCase)
      }
      if(Numbers.checked){
         arr.push(getRandomNumber)
      }
      if(Symbols.checked){
         arr.push(generateSymbol)
      }
      arr.forEach((e)=>{
         //Here the array contains functions so we need to call them thats Y e(){forEach loop} or arr[i](){for loop}  if its other than fn the e is enough right?
         password+=e() 
      })
      for(let i=0;i<p_len-checkboxCount;i++){
         let randomindex=getrandomInteger(0,arr.length-1)
         password+=arr[randomindex]() // Here its a fn call in for loop case as mentioned above
      }
      password=shuffle_pswd(Array.from(password))
      input_text.value=password
      console.log(password.length)
      setTimeout(()=>{
        input_text.value=''
        password=""
      },2000)
      calStrength()
      setTimeout(()=>{
         document.querySelector('.outer_layer').classList.remove("animate")
      },3000)
      
      

      
})