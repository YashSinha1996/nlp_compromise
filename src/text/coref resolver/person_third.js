"use strict"
//Pronouns like he, she
const person_third=function (terms,index,sentence_no,options,list) {

	//Dummy variables to shift in male/female terms, as thier logic is exactly the same.
	//Done in order to avoid code repeat.
	let pronoun_list=false;
	let noun_list=false;
	let type_3=null;
	let subject=null;
	if(terms[index].normal=="he" || terms[index].normal=="him" || terms[index].normal=="himself" || terms[index].normal=="his")
	{
		list.Pronouns.MalePerson=list.Pronouns.MalePerson||[];
		pronoun_list=list.Pronouns.MalePerson;
		if(list.Noun && list.Noun.Person && list.Noun.Person.Male) 
		{
			noun_list=list.Noun.Person.Male;
		}
		type_3="male";
		singular="single";
		subject="subject";
		type_act="normal";
		if(terms[index].normal=="him") {subject="object"; type_act="object";}
		if(terms[index].normal=="himself") {type_act="reflexive";}
		if(terms[index].normal=="his") {type_act="possesive";}
	}
	else if(terms[index].normal=="she" || terms[index].normal=="her" || terms[index].normal=="herself" || terms[index].normal=="hers")
	{
		list.Pronouns.FemalePerson=list.Pronouns.FemalePerson||[];
		pronoun_list=list.Pronouns.FemalePerson;
		if(list.Noun && list.Noun.Person && list.Noun.Person.Female) 
		{
			noun_list=list.Noun.Person.Female;
		}
		type_3="female";
		singular="single";
		subject="subject";
		type_act="normal";
		if(terms[index].normal=="her") {subject="object"; type_act="object";}
		if(terms[index].normal=="herself") {type_act="reflexive";}
		if(terms[index].normal=="hers") {type_act="possesive";}
	}
	else if(terms[index].normal=="they" || terms[index].normal=="them" || terms[index].normal=="themselves" || terms[index].normal=="theirs"||terms[index].normal=="their")
	{
		list.Pronouns.Group=list.Pronouns.Group||[];
		pronoun_list=list.Pronouns.Group;
		if(list.Noun && list.Noun.groups)
		{
			noun_list=list.Noun.groups;
		}
		type_3="group";
		singular="plural";
		subject="subject";
		type_act="normal";
		if(terms[index].normal=="them") {subject="object"; type_act="object";}
		if(terms[index].normal=="themself") {type_act="reflexive";}
		if(terms[index].normal=="theirs"||terms[index].normal=="their") {type_act="possesive";}
	}
	//ref_he represents wheather the pronoun refers to another pronoun
	let ref_he=false;
	if(pronoun_list)
	{
		let len=pronoun_list.length;
		let co_ref=pronoun_list[len-1];	//The last 'he' or 'him' or 'his',etc
		if(noun_list) 
		{
			let last_man=noun_list[noun_list.length-1];
			if(last_man.sentence_no<co_ref.sentence_no)	//If the last man appeared before the last he, we refer the 'he'
			{
				ref_he=true;
			}
			//in case of "He killed drake." over "Drake killed him."
			else if(last_man.sentence_no==co_ref.sentence_no && co_ref.type[0]==subject) //== is delibrate
			{
				ref_he=true;
			}
		}
		else 
		{
			ref_he=true;
		}
	}
	if(ref_he)
	{
		let len=pronoun_list.length;
		let co_ref=pronoun_list[len-1];
		let ref={
				"type":[subject,"third",singular,type_3,type_act],
				"sentence_no":sentence_no,
				"index":index,
				"co_ref":co_ref.index,
				"co_ref_sent":co_ref.sentence_no,
				"ref":co_ref.ref,
				"ref_index":co_ref.ref_index,
				"noun_array":co_ref.noun_array,
				"noun_index":co_ref.noun_index,
				"noun_sent_no":co_ref.noun_sent_no
		}
		//Add to the pronoun list
		pronoun_list.unshift(ref);
		//Add the reference to the noun, if it has a valid reference
		if(co_ref.noun_array)
		{
			co_ref.noun_array[co_ref.noun_index].references.unshift({"sentence_no":sentence_no,"index":index});
		}
	}
	else
	{
		if(noun_list)
		{
			let len=noun_list.length;
			let man=noun_list;
			let last_man=false;
			let sent=man[len-1].sentence_no;
			let n_index=len-1;
			//Finds the first subject last male ref and sets he to refer to that.
			//If the most recent male refernce sentence didn't have a male subject, set that male ref to he ref
			for (var i = man.length - 1; men[i].sentence_no<=sent; i--) {
				if(man[i].is_subject==subject){
					last_man=man[i];
					n_index=i;
				}
			}
			if(!last_man) last_man=men[len-1];
			let ref={
				"type":[subject,"third",singular,type_3,type_act],
				"sentence_no":sentence_no,
				"index":index,
				"co_ref":null,
				"co_ref_sent":null,
				"ref":last_man.details
				"ref_index":last_man.index,
				"noun_array":men,
				"noun_index":n_index,
				"noun_sent_no":sent
			}
			//Add to the pronoun list
			pronoun_list.unshift(ref);
			//Add the reference to the noun, if it has a valid reference
			if(men)
			{
				men[men.n_index].references.unshift({"sentence_no":sentence_no,"index":index});
			}
		}
		else
		{
			let ref={
				"type":[subject,"third",singular,type_3,type_act],
				"sentence_no":sentence_no,
				"index":index,
				"co_ref":null,
				"co_ref_sent":null,
				"ref":"unrefernced",
				"ref_index":"unrefernced",
				"noun_array":null,
				"noun_index":null,
				"noun_sent_no":null
			}
			//Add to the pronoun list
			pronoun_list.unshift(ref);
		}
	}
}
module.exports=person_third;