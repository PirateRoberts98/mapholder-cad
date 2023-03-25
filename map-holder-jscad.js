
    
const {  cube,cuboid, cylinder, sphere,cylinderElliptic } = require('@jscad/modeling').primitives
const { translate,translateX,translateY, translateZ, scale, rotateX } = require('@jscad/modeling').transforms
const { union, intersect, scission, subtract } = require('@jscad/modeling').booleans
const { degToRad } = require('@jscad/modeling').utils

// HOW TO BUILD
// TLDR: Use https://www.openjscad.xyz/


////////////////////////////////////////// 3M Ring ////////////////////////////////////////// 

var mWidth,mHeight,mDepth;

const _3M_Sizing = {
    Medium: "medium",
    Large: "large"
}

function generate3MSupport(width,height,depth) {
    return cuboid({size:[width,height,depth]});}


function addScrewMount(shape) {
    return subtract(shape,cylinderElliptic({height: 5, startRadius: [7,7], endRadius: [5, 5]}));
}

function normalize(height,shape){return translateZ(height/2,rotateX(degToRad(90),shape))}

function get3MSizes(size){
    // To ensure 3m strip has some space on side
    var spacer = 1.1
    switch(size){
        case _3M_Sizing.Large:
            return [mWidth,mHeight,mDepth] = [19*spacer,73,10];a
            break ;
        case _3M_Sizing.Medium:
        default:
            return [mWidth,mHeight,mDepth] = [16*spacer,53,5];
    }
}

function support3M(size){
    // Units in mm
    [mWidth,mHeight,mDepth] = get3MSizes(size)
    return normalize(mHeight,generate3MSupport(mWidth,mHeight,mDepth));
    }



////////////////////////////////////////// Chessex Map Rings   ////////////////////////////////////////// 
 


const chessex_Sizing = {
        Battlemap: "battlemap",
        Mondomap: "mondomap"
    }

function generateBaseModel(radius,height){
    // inner Radius & total height of base ring
    var base = translateZ(height/2,cylinder({radius:radius,height:height}));
    var walls = cylinder({radius:radius*(cBaseWallFactor),height:height*1.5});
    return translateZ(height*1.5/2,subtract(walls,base));
}

        // Units in mm
var cRad,cHeight;
let cBaseWallFactor= 1.1
let expansion = 0.2;

    function generateRingModel(radius,height){

        // inner Radius & total height of base ring
        var base = translateZ(height/2,cylinder({radius:radius*cBaseWallFactor,height:height*3}));
        var walls = cylinder({radius:radius*(cBaseWallFactor+expansion),height:height*1.5});
        return translateZ(height*1.5/2,subtract(walls,base));
    }

    function getChessexSizes(size){
        switch(size){
            case chessex_Sizing.Battlemap:
                return [cRad,cHeight] = [45,10];
                break ;
            case chessex_Sizing.Mondomap:
            default:
                return [cRad,cHeight] = [60,20];
        }
    }



    function ChessexBase(size){

        var radius,height;
        [radius,height] = getChessexSizes(size)
        return generateBaseModel(radius,height);}

    function ChessexRing(size){
        var radius,height;

        [radius,height] = getChessexSizes(size)

        return generateRingModel(radius,height);}


        function ChessexStand(mapSize,stripSize){

            [cRad,cHeight] = getChessexSizes(mapSize)
            var list = [];
            list.push(
                union (
                    translateY(cRad*1.1,support3M(stripSize)),
                    ChessexBase(mapSize)));
            list.push(translateX((expansion+2.3)*cRad,
                union (
                    translateY(cRad*(cBaseWallFactor+expansion),support3M(stripSize)),
                    ChessexRing(mapSize))));    
            // For Mondomap, may need two rings
            if (mapSize == chessex_Sizing.Mondomap){
                list.push(translateX(-1*(expansion+2.3)*cRad,
                    union (
                        translateY(cRad*(cBaseWallFactor+expansion),support3M(stripSize)),
                        ChessexRing(mapSize))));      
            }
    
            return list;
        }

    



////////////////////////////////////////// Main Assembly  ////////////////////////////////////////// 

const main = () => {
    return ChessexStand(chessex_Sizing.Mondomap,_3M_Sizing.Large);

}
module.exports = { main }