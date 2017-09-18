"use strict"
//const noun_checker = require('../../term/noun/noun.js');
let fp_single="unrefernced";
let fp_plural="unrefernced";
let sp="unrefernced";
//Pronouns like he, she & they
const person_third=require("./person_third.js");
//It
const abstract_third=require("./abstract_third.js");
/*
//For who, whose, whom,and  whoever & whomever seem more like indefinite
const who_pronoun=function (terms,index,sentence_no,options,list) {

}
//For which and why
const which_pronoun=function (terms,index,sentence_no,options,list) {

}
//For when as a pronoun
const when_pronoun=function (terms,index,sentence_no,options,list) {

}*/
//It and it's derivative
//Checks wheather it's a an object
const is_subject_exception=require("./subject_exception.js");
let pronouns={
	"i":fp_single,
	"me":fp_single,
	"we":fp_plural,
	"us":fp_plural,
	"you":sp,
	"my":fp_single,
	"mine":fp_single,	//Incorrectly always classified as a possesive pronoun. Will fix later. See TODO.
	"yours":sp,
	"myself":fp_single,
	"yourself":sp,
	"our":fp_plural,
	"ours":fp_plural,
	"your":sp,
	"he":person_third,
	"she":person_third,
	"him":person_third,
	"her":person_third,
	"they":person_third,
	"them":person_third,
	"himself":person_third,
	"herself":person_third,
	"themselves":person_third,
	"his":person_third,
	"hers":person_third,
	"their":person_third,
	"theirs":person_third,
	"who":who_pronoun,
	"whom":who_pronoun,
	"whose":who_pronoun,
	"which":which_pronoun,
	"it":abstract_third,
	"its":abstract_third,
	"itself":abstract_third
}

const pronoun_resolve=function (terms,options,list,sentence_no) {
	options=options||{};
	list=list||{};
	//console.log("ok");
	//optional setting, set 'I' reference
	if (options.fp_single) {
		fp_single=options.fp_single;
	}
	//optional setting, set 'we' reference
	if (options.fp_plural) {
		fp_plural=options.fp_plural;
	}
	//optional setting, set 'you' reference
	if (options.sp) {
		sp=options.sp;
	}
	for (let i = 0 ; i < terms.length; i++) {
		if (terms[i].pos.Preposition) {
			//#See todo	
		}
		else if(terms[i].pos.Conjuction) {
			//#
		}
	}
	for (let i = 0 ; i < terms.length; i++) {
		console.log(i);
		if (pronouns[terms[i].normal]){
			;
		}
		//If the term is a noun, add it to context with proper formatting
		else if (terms[i].pos.Noun) {
			list.Noun=list.Noun||{};
			//List of all nouns
			list.Noun.Nounlist=list.Noun.Nounlist||[];
			//Tracks the noun's position, and the actual textpe
			list.Noun.Nounlist.unshift({"sentence_no":sentence_no,"index":index,"text":terms[i].normal,"type":"None"})
			//If the noun is a person
			console.log("A noun "+terms[i].normal);
			if (terms[i].pos.Person) {
				list.Noun.Person=list.Noun.Person||{};
				//If the noun is man, add his full name to the list. 
				let person={
								"sentence_no":sentence_no,
								"index":index,
								"honourific":terms[i].honourific,
								"firstName":terms[i].firstName,
								"middleName":terms[i].middleName,
								"lastName":terms[i].lastName,
								"details":terms[i],
								"references":[]
							}
				if(terms[i].pos.MalePerson){
					list.Noun.Person.Male=list.Noun.Person.	Male||[];
					let is_subject="subject";
					let last_male=list.Nounlist.length-1;
					if(list.Nounlist[last_male].sentence_no===sentence_no)
					{
						is_subject=is_subject_exception(terms,i,sentence_no,[list.Noun.Person.Male,list.Nounlist]);
					}
					person["is_subject"]=is_subject;
					list.Noun.Person.Male.unshift(person)
					list.Noun.Nounlist[list.Noun.Nounlist.length-1].type="MalePerson";
				}
				//If the noun is woman, add her full name to the list. 
				else if(terms[i].pos.FemalePerson){
					list.Noun.Person.Female=list.Noun.Person.Female||[];
					let is_subject="subject";
					let last_male=list.Nounlist.length-1;
					if(list.Nounlist[last_male].sentence_no===sentence_no)
					{
						is_subject=is_subject_exception(terms,i,sentence_no,[list.Noun.Person.Female,list.Nounlist]);
					}
					person["is_subject"]=is_subject;
					list.Noun.Person.Female.unshift(person)
					list.Noun.Nounlist[list.Noun.Nounlist.length-1].type="FemalePerson";
				}

				list.Noun.Nounlist[list.Noun.Nounlist.length-1].type="Person";	
				list.Noun.Person.Personlist=list.Noun.Person.Personlist||[];
				//if(list.Noun.Person.Personlist.length>10) list.Noun.Person.Personlist.pop();
				//Keep track of people irrespective of sex.
				list.Noun.Person.Personlist.unshift(person);
			}
			//Track groups and organizations (for stuff like 'they')
			if ((terms[i].pos.Organization||terms[i].pos.Plural )&& !(terms[i].pos.Group)) {
				list.Noun.groups=list.Noun.groups||[];
				let person={"text":terms[i].normal,"details":terms[i],"references":[]};
				let is_subject="subject";
				let last_male=list.Nounlist.length-1;
				if(list.Nounlist[last_male].sentence_no===sentence_no)
				{
					is_subject=is_subject_exception(terms,i,sentence_no,[list.Noun.Person.Female,list.Nounlist]);
				}
				person["is_subject"]=is_subject;
				list.Noun.groups.unshift(person);
				list.Noun.Nounlist[list.Noun.Nounlist.length-1].type="Group";
			}
			//Track date and time.
			if (terms[i].pos.Date) {
				list.Noun.Whens=list.Noun.Whens||[];
				let newdate={
					"year":terms[i].data.year,
					"month":terms[i].data.month,
					"day":terms[i].data.day,
					"text":terms[i].normal,
					"details":terms[i],
					"references":[]
				}
				let is_subject="subject";
				let last_male=list.Nounlist.length-1;
				if(list.Nounlist[last_male].sentence_no===sentence_no)
				{
					is_subject=is_subject_exception(terms,i,sentence_no,[list.Noun.Person.Female,list.Nounlist]);
				}
				person["is_subject"]=is_subject;
				list.Noun.Whens.unshift(newdate);
				list.Noun.Nounlist[list.Noun.Nounlist.length-1].type="Time";
			}
			//Track places
			if (terms[i].pos.Place) {
				list.Noun.Wheres=list.Noun.Wheres||[];
				let person={"text":terms[i].normal,"details":terms[i],"references":[]};
				let is_subject="subject";
				let last_male=list.Nounlist.length-1;
				if(list.Nounlist[last_male].sentence_no===sentence_no)
				{
					is_subject=is_subject_exception(terms,i,sentence_no,[list.Noun.Person.Female,list.Nounlist]);
				}
				person["is_subject"]=is_subject;
				list.Noun.Wheres.unshift(person);
				list.Noun.Nounlist[list.Noun.Nounlist.length-1].type="Place";
			}
			//Track uncountable or infinitive,refered by 'it'
			if (terms[i].pos.Infinitive) {
				list.Noun.Infinit=list.Noun.Infinit||[];
				let person={"text":terms[i].normal,"details":terms[i],"references":[]};
				let is_subject="subject";
				let last_male=list.Nounlist.length-1;
				if(list.Nounlist[last_male].sentence_no===sentence_no)
				{
					is_subject=is_subject_exception(terms,i,sentence_no,[list.Noun.Person.Female,list.Nounlist]);
				}
				person["is_subject"]=is_subject;
				list.Noun.Infinit.unshift(person);
				list.Noun.Nounlist[list.Noun.Nounlist.length-1].type="Infinitive";
			}
		}
		//Track actions, as they are generally referred by it
		else if (terms[i].pos.Verb) {
			list.Noun=list.Noun||{};
			list.Action=list.Action||[];
			let rootform=terms[i].root()
			if (rootform!=="is") {
				list.Action.unshift({"basic":rootform,"details":terms[i],"references":[]});
			}
		}
	}
	for (var i = 0; i < terms.length ; i++) {
		console.log("Pronoun :"+i);
		list.Pronoun=list.Pronoun||{};
		if (pronouns[terms[i].normal]){
			pronouns[terms[i].normal](terms,i,options,list);
		}
	}
	return list;
}

module.exports=pronoun_resolve;