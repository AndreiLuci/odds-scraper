import casa from "./src/sites/casapariurilor"
import superbet from "./src/sites/superbet"
import betano from "./src/sites/betano"
import unibet from "./src/sites/unibet"
import maxbet from "./src/sites/maxbet"
import luck from "./src/sites/luck"
import winbet from "./src/sites/winbet"
// import puppeteer from 'puppeteer';

async function main(){
    // const x = await new casa().start()
    // console.log(x[0].markets[0])
    //await new superbet().start()
    await new winbet().start()
   
}

main()


// const browser = await puppeteer.launch({
//     headless:false
// });
// const page = await browser.newPage();
// await page.goto('https://pariuri.luck.com/ro/sport/fotbal_1');
// await page.setViewport({width: 1080, height: 1024});
// while(true){
// const elements = await page.$$('.bg-bianco.nero.bordo-tondo.elemento-macro.pointer.filter.Zprincipali.elementoDropdown')
// if(elements.length > 0){
//     elements.forEach(async element=>{
//         const id = await page.evaluate(el=>el.attributes[0].value, element)
//         const name = await page.evaluate(el=>el.textContent, element)
//        if(!chestie.hasOwnProperty(id)){
//         chestie[id] = name
//         console.log(chestie)
//        }
//     })
    
// }
// }
