import { FormControl, ValidationErrors } from "@angular/forms";

export class MyShopValidators {

    //공백만 있는지 체크하는 validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors {

        //string이 오직 whitespace만 포함하고 있는지 체크한다.
        if((control.value != null) && (control.value.trim().length === 0)){

            //공백만 포함하고 있으므로 에러오브젝트 리턴해주어야 한다.
            //HTML 템플릿은 이 에러키를 체크하여 에러메시지 보여줄지 말지 결정할 것이다.
            return { 'notOnlyWhitespace': true };
        }
        else {
            //유효한 값. 리턴 null을 해준다.
            return null!;
        }
    }
}
