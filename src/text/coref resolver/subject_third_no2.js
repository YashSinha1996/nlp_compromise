
const subject_third_single=function (terms,index,sentence_no,options,list) {
	if(terms[index]=="he")
	{
		let ref_he=false;
		if(list.Pronouns.MalePerson)
		{
			let len=list.Pronouns.MalePerson.length;
			let co_ref=list.Pronouns.MalePerson[len-1];	//The last 'he' or 'him' or 'his',etc
			if(list.Noun && list.Noun.Person && list.Noun.Person.Male) 
			{
				let last_man=list.Noun.Person.Male[list.Noun.Person.Male.length-1];
				if(last_man.sentence_no<co_ref.sentence_no)	//If the last man appeared before the last he, we refrer the 'he'
				{
					ref_he=true;
				}
				//in case of "He killed drake." over "Drake killed him."
				else if(last_man.sentence_no==co_ref.sentence_no && co_ref.type[0]==="subject") //== is delibrate
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
			let len=list.Pronouns.MalePerson.length;
			let co_ref=list.Pronouns.MalePerson[len-1];
			let ref={
					"type":["subject","third","single","male"],
					"sentence_no":sentence_no,
					"index":index,
					"co_ref":co_ref.index,
					"ref":co_ref.ref,
					"ref_index":co_ref.ref_index,
					"noun_array":co_ref.noun_array,
					"noun_index":co_ref.noun_index,
					"noun_sent_no":co_ref.noun_sent_no
			}
			//Add to the pronoun list
			list.Pronouns.MalePerson.unshift(ref);
			//Add the reference to the noun, if it has a valid reference
			if(co_ref.noun_array)
			{
				co_ref.noun_array[co_ref.noun_index].references.unshift({"sentence_no":sentence_no,"index":index});
			}
		}
		else
		{
			if(list.Noun && list.Noun.Person && list.Noun.Person.Male)
			{
				let len=list.Noun.Person.Male.length;
				let men=list.Noun.Person.Male;
				let last_man=false;
				let sent=men[len-1].sentence_no;
				let n_index=len-1;
				//Finds the first subject last male ref and sets he to refer to that.
				//If the most recent male refernce sentence didn't have a male subject, set that male ref to he ref
				for (var i = man.length - 1; men[i].sentence_no<sent; i--) {
					if(man[i].is_subject){
						last_man=man[i];
						n_index=i;
					}
				}
				if(!last_man) last_man=men[len-1];
				let ref={
					"type":["subject","third","single","male"],
					"sentence_no":sentence_no,
					"index":index,
					"co_ref":null,
					"ref":last_man.details
					"ref_index":last_man.index,
					"noun_array":men,
					"noun_index":n_index,
					"noun_sent_no":sent
				}
			}
			else
			{
				let ref={
					"type":["subject","third","single","male"],
					"sentence_no":sentence_no,
					"index":index,
					"co_ref":null,
					"ref":"unrefernced",
					"ref_index":"unrefernced",
					"noun_array":null,
					"noun_index":null,
					"noun_sent_no":null
				}
				//Add to the pronoun list
				list.Pronouns.MalePerson.unshift(ref);
			}
		}
	}
}
