
#include <bur/plctypes.h>
#ifdef _DEFAULT_INCLUDES
#include <AsDefault.h>
//constants//
#ifdef _REPLACE_CONST
#define MyConstant 123U
#else
_GLOBAL_CONST unsigned char MyConstant;
#endif

void _INIT ProgramInit(void)
{
	dummy = 1;
}

void _CYCLIC ProgramCyclic(void)
{

}

void _EXIT ProgramExit(void)
{

}

