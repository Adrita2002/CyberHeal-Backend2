var changeText=document.getElementById("feature1");
var inner=document.getElementById("inner");
var inner1=document.getElementById("inner1");
var Text2=document.getElementById("feature2");
inner.addEventListener('mouseover', myfunction);
inner.addEventListener('mouseout', reverse);

inner1.addEventListener('mouseover', function myfunction1(){
    Text2.innerHTML="hi";
});
inner1.addEventListener('mouseout', function reverse2(){
    Text2.innerHTML="FILE A COMPLAINT";
});

function myfunction(){
    changeText.innerHTML="hello<br><a href='/complaintform'>File Complaint</a>";
    

}
function reverse(){
    changeText.innerHTML="hello<br><a href='/payment'>Guidance Counselling</a>";
}
