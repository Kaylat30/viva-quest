import { Form, Link,useNavigate,useNavigation ,useActionData} from "react-router-dom"
import { useState,useEffect } from "react";
import { registerUserWithEmailAndPassword } from '../api';

export async function action({request}) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  try {
    // Attempt to log in the user
    await registerUserWithEmailAndPassword(email, password);

    return { redirect: "/login" };
  } catch (err) {
    return { error: err.message };
  }
}

export default function Signup()
{
    const actionData= useActionData()
    const navigation = useNavigation()
    const navigate = useNavigate() 
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
      if (actionData && actionData.redirect) {
          navigate(actionData.redirect);
      }})

      const handleShowPassword = () => {
        setShowPassword(!showPassword); // Toggle the showPassword state
      };
    return (
        <>
            {/* form section */}
            <div className='flex items-center flex-col my-10 space-y-3 lg:ml-28 lg:mr-28 xsm:ml-7 xsm:mr-7'>
                <h1 className="font-bold text-xl">Sign Up</h1>
                {actionData && actionData.error && <h3 className="text-red-500">{actionData.error}</h3>}
                <Form className='flex flex-col items-center space-y-7 shadow-md p-10' replace method="post">
                    <input type='email' placeholder='Email' name="email" className='border md:w-96 md:p-4  xsm:p-2 xsm:w-72 rounded-lg' />
                    <input type={showPassword ? "text" : "password"} name="password" placeholder='Password' className='border md:w-96  md:p-4  xsm:p-2 xsm:w-72 rounded-lg' />
                    <label className="cursor-pointer">
                    <input  type="checkbox" className="form-checkbox h-5 w-5" checked={showPassword} onChange={handleShowPassword} />Show Password</label>
                    <button
                        disabled={navigation.state === "submitting"}
                        type='submit'
                        className="md:p-4 xsm:p-2 xsm:px-4 md:px-9 font-bold text-white bg-brightRed rounded-md baseline hover:shadow-2xl"
                    >
                    {navigation.state === "submitting"
                        ? "Signing up..."
                        : "SIGN UP"
                    }
                    </button>

                </Form>
                <div>Already have an account? <Link className="text-brightRed" to='/login'>Sign in</Link></div>

            </div>
        </>
    )
}
    
  