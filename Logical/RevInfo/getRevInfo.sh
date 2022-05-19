#!/bin/sh

# Copyright (c) 2021 Loupe | info@loupe.team | https://loupeteam.github.io/Sandbox/ | Version 1.00
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
# 1. RevInfo requires a prebuild option in Automation Studio in EACH CONFIGURATION to retrieve status information from Git
#    Navigate to via: Project (Menu) -> Change Runtime Version (dropdown) -> Build Events (tab) -> Prebuild (field)
#    The entire following line should be put into the pre-build step of EACH CONFIGURATION that should run this script
#    "$(AS_PROJECT_PATH)\Logical\RevInfo\getRevInfo.sh" "$(AS_PROJECT_PATH)\Logical\RevInfo" "$(AS_CONFIGURATION)" "$(AS_USER_NAME)"
#
# 2. Add the RevInfo.var to the RevInfo folder package in Automation Studio, if it doesn't already exist.	
#    See RevInfo.var, but a red x icon? You may have cloned the repo, and this file wasn't present. It will get built if you have this script configured to run. Keep going!
#    If you want RevInfo constants to be global, ensure RevInfo.var is configured global via: right click RevInfo.var -> Properties -> Details (tab) -> Global (radio button)
#
# 3. Add *RevInfo.var to your .gitignore file in Git or you'll be tracking changes of each build. This is BAD. Don't commit before this!
#
# 4. Ensure that .sh files are executed by Git by default.
#    Nagivate to the folder that contains this .sh file -> Right Click -> Open With -> Choose another app -> Select Git and Check 'always use this app to open .sh files' box

# This script will update the revision and build information by changing the directory to the path and updating a set of constants that can be
# used throughout your program.
#
# $1 = Path to script
# $2 = Configuration being built
# $3 = User who built configuration


cd  "$1" 

cat > RevInfo.var << EOF
VAR CONSTANT
	revision : STRING[80] := '$(git describe --always --tags)';
	revisionDate : STRING[80] := '$(git show -s --date=default --pretty=format:%ci)';
	revisionAuthor : STRING[80] := '$(git show -s --pretty=format:%an)';
	branchName : STRING[80] := '$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')';
	uncommittedChanges : STRING[80] := '$(git diff --shortstat)';
	buildDate  : STRING[80] := '$(date +"%Y-%m-%d %H:%M:%S %z")';
	buildConfiguration : STRING[80] := '$2';
	builder : STRING[80] := '$3';
END_VAR
EOF

# Failed attempts to get the directory where the .sh file is stored? Uncomment below to debug
#
# echo "Script executed from: ${PWD}"
# BASEDIR=$(dirname $0)
# echo "Script location: ${BASEDIR}"
# DIR="$( cd "$( dirname "$0" )" && pwd )"
# echo "DIR = $DIR"
# DIR2="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# echo "DIR2 = $DIR2"
# DIR3=${0%\*}
# echo "DIR3 = $DIR3"
# echo "\$0 = $0"
# current_dir=$(pwd)
# script_dir=$(dirname $0)
# echo $current_dir
# echo $script_dir
# $SHELL