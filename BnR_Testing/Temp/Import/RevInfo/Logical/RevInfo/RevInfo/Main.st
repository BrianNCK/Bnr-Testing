
PROGRAM _INIT
	
	// Instantiation
	// TODO: Map below into the logger, Machine Settings recipe, or to a diagnostics HMI page
	revision; 			
	revisionDate;		
	revisionAuthor;
	branchName;
	uncommittedChanges;	
	buildDate;  			
	buildConfiguration; 	
	builder;	
	 
END_PROGRAM

PROGRAM _CYCLIC
	
	// TODO: Tie into to a passive alarm so you won't leave uncommited code in the field.
	UncommittedCodeRunning := (brsstrcmp(ADR(uncommittedChanges),ADR('')) <> 0);

END_PROGRAM

PROGRAM _EXIT
	
	 
END_PROGRAM

