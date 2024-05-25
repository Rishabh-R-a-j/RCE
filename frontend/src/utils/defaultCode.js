const def_code = {
    C:`#include <bits/stdc++.h>
  using namespace std;
  int main() {
      cout<<"Hello world"<<endl;
      return 0;
  }`,
    Python: `print("Hello World")`,
    Javascript: `console.log("Hello World");`,
    Java: `class HelloWorld {
      public static void main(String[] args) {
        System.out.println("Hello World");
      }
    }`,
  };
  export function returncode(x) {
    if (x === 1) {
      return def_code.C;
    } else if (x === 2) {
      return def_code.Python;
    } else if (x === 3) {
      return def_code.Javascript;
    } else {
      return def_code.Java;
    }
  }

  export const returnIdx=(x)=>{
    if(x=="c++") return 1
    else if(x=="python") return 2
    else if(x=="javascript") return 3
    else return 4;
  }