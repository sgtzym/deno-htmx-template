import { Shell } from '~shared/layout/shell.tsx'

interface SigninPageProps {
	error?: string
}

export const SigninPage = ({ error }: SigninPageProps) => (
	<Shell title='Anmelden'>
		<main class='min-h-screen flex items-center justify-center p-6'>
			<div class='card w-full max-w-sm shadow-xl bg-base-100'>
				<div class='card-body gap-4'>
					<h1 class='card-title text-2xl'>Anmelden</h1>

					{error && (
						<div role='alert' class='alert alert-error'>
							<span>{error}</span>
						</div>
					)}

					<form method='post' action='/signin' class='flex flex-col gap-4'>
						<label class='form-control'>
							<div class='label'>
								<span class='label-text'>E-Mail</span>
							</div>
							<input
								type='email'
								name='email'
								class='input w-full'
								required
								autofocus />
						</label>

						<label class='form-control'>
							<div class='label'>
								<span class='label-text'>Passwort</span>
							</div>
							<input type='password' name='password' class='input w-full' required />
						</label>

						<button type='submit' class='btn btn-primary'>Anmelden</button>
					</form>
				</div>
			</div>
		</main>
	</Shell>
)
